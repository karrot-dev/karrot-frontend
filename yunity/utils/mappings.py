

def _valuable_metadata_mappings(doc_type):
    _, category_name = doc_type.split('::')
    mappings = {
        'foodsharing': {
            'allergies': {"type": 'string'},
            'weight': {"type": 'integer'},
        },
        'books': {
            'author': {"type": 'string'},
            'isbn': {
                'type': 'string',
                'index': 'not_analyzed',
            }
        }
    }
    return mappings.get(category_name)


def valuable_mapping(doc_type):
    metadata = _valuable_metadata_mappings(doc_type)
    if metadata:
        return {
            doc_type: {
                'properties': {
                    'id': {
                        'type': 'integer',
                        'store': True,
                    },
                    'locations': {
                        'index_name': 'location',
                        'properties': {
                            'point': {
                                'type': 'geo_point',
                                'doc_values': True,
                            }
                        }
                    },
                    "metadata": {
                        "type": "object",
                        "properties": metadata,
                    }
                }
            }
        }


# _opportunity_metadata_mappings = _valuable_metadata_mappings
opportunity_mapping = valuable_mapping
