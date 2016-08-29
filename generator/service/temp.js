import <%= upCaseName %>Com from './<%= name %>.service';
import <%= upCaseName %> from './<%= name %>.wrapper';

let <%= name %>Module = angular.module('<%= upCaseName %>', []);

.service('<%= upCaseName %>Communication', <%= upCaseName %>Com)

.service('<%= upCaseName %>', <%= upCaseName %>)

.name;

export default <%= name %>Module;
