"""
What's the big idea?

An endpoint that traverses all restful endpoints producing a swagger 2.0 schema
If a swagger yaml description is found in the docstrings for an endpoint
we add the endpoint to swagger specification output

Based on https://github.com/gangverk/flask-swagger
Under MIT License

"""
import inspect

import re
import yaml
import yunity.api.urls
from collections import defaultdict
from django.http.response import JsonResponse


def _sanitize(comment):
    return comment.replace('\n', '<br/>') if comment else comment


def _parse_docstring(obj, process_doc):
    first_line, other_lines, swag = None, None, None
    full_doc = inspect.getdoc(obj)
    if full_doc:
        line_feed = full_doc.find('\n')
        if line_feed != -1:
            first_line = process_doc(full_doc[:line_feed])
            yaml_sep = full_doc[line_feed + 1:].find('---')
            if yaml_sep != -1:
                other_lines = process_doc(full_doc[line_feed + 1:line_feed + yaml_sep])
                separator = full_doc[line_feed + yaml_sep + 3:].find('...')
                if separator > 0:
                    yaml_doc = full_doc[line_feed + yaml_sep:line_feed + yaml_sep + separator + 3]
                else:
                    yaml_doc = full_doc[line_feed + yaml_sep:]

                swag = yaml.safe_load(yaml_doc)
            else:
                other_lines = process_doc(full_doc[line_feed + 1:])
        else:
            first_line = full_doc
    return first_line, other_lines, swag


def _extract_definitions(alist, level=None):
    """
    Since we couldn't be bothered to register models elsewhere
    our definitions need to be extracted from the parameters.
    We require an 'id' field for the schema to be correctly
    added to the definitions list.
    """

    def _extract_array_defs(source):
        # extract any definitions that are within arrays
        # this occurs recursively
        ret = []
        items = source.get('items')
        if items is not None and 'schema' in items:
            ret += _extract_definitions([items], level + 1)
        return ret

    # for tracking level of recursion
    if level is None:
        level = 0

    defs = list()
    if alist is not None:
        for item in alist:
            schema = item.get("schema")
            if schema is not None:
                schema_id = schema.get("id")
                if schema_id is not None:
                    defs.append(schema)
                    ref = {"$ref": "#/definitions/{}".format(schema_id)}

                    # only add the reference as a schema if we are in a response or
                    # a parameter i.e. at the top level
                    # directly ref if a definition is used within another definition
                    if level == 0:
                        item['schema'] = ref
                    else:
                        item.update(ref)
                        del item['schema']

                # extract any definitions that are within properties
                # this occurs recursively
                properties = schema.get('properties')
                if properties is not None:
                    defs += _extract_definitions(properties.values(), level + 1)

                defs += _extract_array_defs(schema)

            defs += _extract_array_defs(item)

    return defs


def get_rules(urlpattern, rule_base=''):
    """
    :param urlpattern: base urlpatterns of the application to document
    :return: list of dictionaries of all rules and methodname/method name pairs for each rule
    """
    urls = []
    for pattern in urlpattern:
        pattern_rule = rule_base + pattern.regex.pattern
        if hasattr(pattern, 'url_patterns'):
            urls.extend(get_rules(pattern.url_patterns, pattern_rule))
        else:
            possible_methods = pattern.callback.view_class.http_method_names
            method_names = list(filter(lambda x: hasattr(pattern.callback.view_class, x), possible_methods))
            methods = list(map(lambda m: getattr(pattern.callback.view_class, m), method_names))
            verb_method = zip(method_names, methods)
            urls.append({'rule': pattern_rule, 'methods': list(verb_method)})
    return urls


def swagger(urlpatterns, process_doc=_sanitize, base=''):
    """
    Call this from an @app.route method like this
    @app.route('/spec.json')
    def spec():
       return jsonify(swagger(app))

    We go through all endpoints of the app searching for swagger endpoints
    We provide the minimum required data according to swagger specs
    Callers can and should add and override at will

    Arguments:
    urlpatterns -- the urlpatterns to inspect

    Keyword arguments:
    process_doc -- text sanitization method, the default simply replaces \n with <br>
    """

    output = {
        "swagger": "2.0",
        "info": {
            "version": "0.0.0",
            "title": "Yunity",
        },
        "paths": defaultdict(dict),
        "definitions": defaultdict(dict)
    }

    paths = output['paths']
    definitions = output['definitions']
    # technically only responses is non-optional
    optional_fields = ['tags', 'consumes', 'produces', 'schemes', 'security',
                       'deprecated', 'operationId', 'externalDocs']

    rules = get_rules(urlpatterns, base)
    for rule in rules:
        operations = dict()
        for verb, method in rule['methods']:
            summary, description, swag = _parse_docstring(method, process_doc)
            if swag is not None:  # we only add endpoints with swagger data in the docstrings
                params = swag.get('parameters', [])
                defs = _extract_definitions(params)
                responses = swag.get('responses', {})
                responses = {
                    str(key): value
                    for key, value in responses.items()
                }
                if responses is not None:
                    defs = defs + _extract_definitions(responses.values())
                for definition in defs:
                    def_id = definition.pop('id')
                    if def_id is not None:
                        definitions[def_id].update(definition)
                operation = dict(
                    summary=summary,
                    description=description,
                    responses=responses
                )
                # parameters - swagger ui dislikes empty parameter lists
                if len(params) > 0:
                    operation['parameters'] = params
                # other optionals
                for key in optional_fields:
                    if key in swag:
                        operation[key] = swag.get(key)
                operations[verb] = operation

        if len(operations):
            rule = rule['rule']
            # must correspond to the paths created in ids.py
            # you can check they are ok by running `curl -s http://localhost:8000/doc | jq -r '.paths | keys | .[]'`
            # 1. remove all the parens that are not named params
            re_parens = r'\([^?()][^?P][^()]+\)'
            while re.search(re_parens, rule):
                rule = re.sub(re_parens, '', rule)
            # 2. reformat named params from: (?P<myparam>...) to: {myparam}
            for arg in re.findall('(\(\?P<(.*?)>[^()]+\))', rule):
                rule = rule.replace(arg[0], '{%s}' % arg[1])
            rule = rule.replace('/?', '/')
            rule = rule.translate(str.maketrans('', '', '^$'))
            paths[rule].update(operations)
    return output


def doc(request):
    return JsonResponse(swagger(yunity.api.urls.urlpatterns, base='/api/'))
