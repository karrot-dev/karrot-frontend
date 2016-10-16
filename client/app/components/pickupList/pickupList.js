import angular from "angular";
import uiRouter from "angular-ui-router";
import pickupListComponent from "./pickupList.component";

let pickupListModule = angular.module("pickupList", [
  uiRouter
])

/*
.filter("groupByDate", ($filter) => {
    var mArr = null,
        mGroupBy = null,
        mRetArr = null,
        getMemoArr = (arr) => {
            var ret = {};
            angular.forEach(arr, (item) => {
                    var groupValue = item.date;
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
        var newMemoArr = getMemoArr(arr);

        if (mGroupBy !== 'date' || !angular.equals(mArr, newMemoArr)) {
            mArr = newMemoArr;
            mGroupBy = 'date';
            mRetArr = [];
            var groups = {};
            angular.forEach(arr, (item) => {
                var groupValue = item.date;
                groupValue = $filter('date')(groupValue, 'yyyy-MM-dd', '');
                if (groups[groupValue]) {
                    groups[groupValue].items.push(item);
                } else {
                    groups[groupValue] = {
                        items: [item]
                    };
                    groups[groupValue].date = groupValue;
                    mRetArr.push(groups[groupValue]);
                }
            });
        }
        return mRetArr;
    };
})
*/
.component("pickupList", pickupListComponent)

.name;

export default pickupListModule;
