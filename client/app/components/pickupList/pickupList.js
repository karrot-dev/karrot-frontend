import angular from 'angular';
import uiRouter from 'angular-ui-router';
import pickupListComponent from './pickupList.component';
import pickupListItem from './pickupListItem/pickupListItem';

let pickupListModule = angular.module('pickupList', [
  uiRouter
])

/*
.filter("groupByDate", ($filter) => {
    var mArr = null,
        mGroupBy = null,
        mRetArr = null,
        getMemoArr = (arr, groupBy) => {
            var ret = {};
            angular.forEach(arr, (item) => {
                    var groupValue = item[groupBy];
                    groupValue = $filter('date')(groupValue, 'yyyy-MM-dd', '');
                    if (ret[groupValue]) {
                        ret[groupValue].push(item);
                    } else {
                        ret[groupValue] = [item];
                    }
                });
            return ret;
        };
    return (arr) => {
        groupBy = 'date';
        var newMemoArr = getMemoArr(arr, groupBy);

        if (mGroupBy !== groupBy || !angular.equals(mArr, newMemoArr)) {
            mArr = newMemoArr;
            mGroupBy = groupBy;
            mRetArr = [];
            var groups = {};
            angular.forEach(arr, (item) => {
                var groupValue = item[groupBy];
                groupValue = $filter('date')(groupValue, 'yyyy-MM-dd', '');
                if (groups[groupValue]) {
                    groups[groupValue].items.push(item);
                } else {
                    groups[groupValue] = {
                        items: [item]
                    };
                    groups[groupValue][groupBy] = groupValue;
                    mRetArr.push(groups[groupValue]);
                }
            });
        }
        return mRetArr;
    };
})

*/

.directive('pickupListItem', pickupListItem)

.component('pickupList', pickupListComponent)

.name;

export default pickupListModule;
