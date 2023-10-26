/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.93103448275862, "KoPercent": 1.0689655172413792};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.958904109589041, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://api.e-valy.com/api/v1/cms/public/products/sales/trending-products"], "isController": false}, {"data": [1.0, 500, 1500, "https://evaly.com.bd/orders/create"], "isController": false}, {"data": [1.0, 500, 1500, "https://evaly.com.bd/shops/sayhan-mart-for-cod-2711387"], "isController": false}, {"data": [1.0, 500, 1500, "https://evaly.com.bd/shops/ahmed-trading-for-flash-sale-cod-9135552"], "isController": false}, {"data": [0.99375, 500, 1500, "https://evaly.com.bd/about/faq"], "isController": false}, {"data": [0.60625, 500, 1500, "https://api.e-valy.com/api/v1/ums/auth/login-email"], "isController": false}, {"data": [1.0, 500, 1500, "https://api.e-valy.com/api/v1/ums/auth/logout"], "isController": false}, {"data": [0.9883333333333333, 500, 1500, "https://api.e-valy.com/api/v1/ums/consumers/campaign/live"], "isController": false}, {"data": [0.975, 500, 1500, "https://evaly.com.bd/products/nokia-c2-smartphone-3gb-ram-32gb-rom-5mp-camera-5.7%22inch-display-1880619"], "isController": false}, {"data": [0.9944444444444445, 500, 1500, "https://api.e-valy.com/api/v1/cms/public/shops?page=1&search=flash%20sale&orderBy=score&orderDirection=DESC"], "isController": false}, {"data": [0.9875, 500, 1500, "https://evaly.com.bd/about/terms-conditions"], "isController": false}, {"data": [1.0, 500, 1500, "https://evaly.com.bd/products/pique-cotton-half-sleeve-polo-for-men-white-and-black-010-4952823"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.975, 500, 1500, "https://www.google-analytics.com/j/collect?v=1&_v=j101&a=1566095720&t=pageview&_s=1&dl=https%3A%2F%2Fevaly.com.bd%2F&ul=en-us&de=UTF-8&dt=Evaly%20%7C%20Online%20shopping%20platform&sd=24-bit&sr=1536x864&vp=1519x730&je=0&_u=QACAAUABAAAAACAAI~&jid=744947263&gjid=1469657933&cid=141729000.1698302517&tid=UA-121203268-1&_gid=541356295.1698302517&_r=1&gtm=457e3an0&gcd=11l1l1l1l1&jsscut=1&z=650625826"], "isController": false}, {"data": [0.9625, 500, 1500, "https://evaly.com.bd/search"], "isController": false}, {"data": [0.995, 500, 1500, "https://evaly.com.bd/shops"], "isController": false}, {"data": [1.0, 500, 1500, "https://api.e-valy.com/api/v1/ums/points/star"], "isController": false}, {"data": [0.9875, 500, 1500, "https://evaly.com.bd/search?page=1&categoryName=Smartphone"], "isController": false}, {"data": [0.625, 500, 1500, "https://www.google-analytics.com/j/collect?v=1&_v=j101&a=1945709514&t=pageview&_s=1&dl=https%3A%2F%2Fevaly.com.bd%2F&ul=en-us&de=UTF-8&dt=Evaly%20%7C%20Online%20shopping%20platform&sd=24-bit&sr=1536x864&vp=1519x730&je=0&_u=QACAAUABAAAAACAAI~&jid=2065405523&gjid=1201262750&cid=141729000.1698302517&tid=UA-121203268-1&_gid=541356295.1698302517&_r=1&gtm=457e3an0&gcd=11l1l1l1l1&jsscut=1&z=1045135442"], "isController": false}, {"data": [0.99375, 500, 1500, "https://evaly.com.bd/about/return-refund"], "isController": false}, {"data": [0.99, 500, 1500, "https://api.e-valy.com/api/v1/ums/auth/me"], "isController": false}, {"data": [0.99875, 500, 1500, "https://api.e-valy.com/api/v1/search/public/products/facets?page=1&limit=10"], "isController": false}, {"data": [0.88, 500, 1500, "https://evaly.com.bd/categories"], "isController": false}, {"data": [0.975, 500, 1500, "https://evaly.com.bd/products/t55-pro-max-smart-watch-with-earbud-black-6088553"], "isController": false}, {"data": [0.99375, 500, 1500, "https://api.e-valy.com/api/v1/ums/address"], "isController": false}, {"data": [1.0, 500, 1500, "https://api.e-valy.com/api/v1/cms/public/products/flash%20sale/campaign-products?orderBy=score&orderDirection=DESC"], "isController": false}, {"data": [0.9875, 500, 1500, "https://evaly.com.bd/shops/a-plus-for-super-flash-hour-cod-6939702"], "isController": false}, {"data": [1.0, 500, 1500, "https://evaly.com.bd/search?page=1&categoryName=Smartwatches"], "isController": false}, {"data": [0.975, 500, 1500, "https://evaly.com.bd/search?page=1&brandName=Individual%20Collection"], "isController": false}, {"data": [1.0, 500, 1500, "https://evaly.com.bd/user/address"], "isController": false}, {"data": [0.84, 500, 1500, "https://evaly.com.bd/"], "isController": false}, {"data": [0.975, 500, 1500, "https://stats.g.doubleclick.net/j/collect?t=dc&aip=1&_r=3&v=1&_v=j101&tid=UA-121203268-1&cid=141729000.1698302517&jid=744947263&gjid=1469657933&_gid=541356295.1698302517&_u=QACAAUAAAAAAACAAI~&z=326954193"], "isController": false}, {"data": [0.975, 500, 1500, "https://stats.g.doubleclick.net/j/collect?t=dc&aip=1&_r=3&v=1&_v=j101&tid=UA-121203268-1&cid=141729000.1698302517&jid=2065405523&gjid=1201262750&_gid=541356295.1698302517&_u=QACAAUAAAAAAACAAI~&z=768783138"], "isController": false}, {"data": [0.9875, 500, 1500, "https://evaly.com.bd/orders"], "isController": false}, {"data": [1.0, 500, 1500, "https://evaly.com.bd/search?page=1&brandName=NOKIA"], "isController": false}, {"data": [0.9875, 500, 1500, "https://evaly.com.bd/auth/login"], "isController": false}, {"data": [1.0, 500, 1500, "https://evaly.com.bd/search?page=1&categoryName=Polo"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2900, 31, 1.0689655172413792, 178.3044827586207, 67, 2829, 114.0, 335.0, 481.9499999999998, 1088.9199999999983, 14.450074990906417, 224.63599202256205, 9.012913119546965], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://api.e-valy.com/api/v1/cms/public/products/sales/trending-products", 80, 0, 0.0, 105.475, 75, 302, 93.5, 139.50000000000003, 212.05000000000007, 302.0, 0.6084621878779121, 1.3887971177906737, 0.31240136257501194], "isController": false}, {"data": ["https://evaly.com.bd/orders/create", 60, 0, 0.0, 139.14999999999998, 91, 332, 120.0, 218.29999999999998, 255.34999999999994, 332.0, 0.4691348371711169, 1.4719563655733219, 0.34116120645842296], "isController": false}, {"data": ["https://evaly.com.bd/shops/sayhan-mart-for-cod-2711387", 20, 0, 0.0, 189.55, 111, 309, 182.0, 261.6, 306.65, 309.0, 1.1872254541137364, 31.225884482963316, 0.9750552801852072], "isController": false}, {"data": ["https://evaly.com.bd/shops/ahmed-trading-for-flash-sale-cod-9135552", 20, 0, 0.0, 174.39999999999998, 108, 469, 134.5, 420.0000000000004, 467.5, 469.0, 0.3007111819453006, 5.539384824798147, 0.26018565156595347], "isController": false}, {"data": ["https://evaly.com.bd/about/faq", 80, 0, 0.0, 156.87499999999997, 85, 647, 122.5, 276.9000000000002, 383.65000000000015, 647.0, 0.5768426517456701, 11.328937593286271, 0.3927768934860043], "isController": false}, {"data": ["https://api.e-valy.com/api/v1/ums/auth/login-email", 80, 31, 38.75, 167.36249999999995, 73, 1160, 108.5, 368.30000000000007, 429.15000000000003, 1160.0, 0.5983321491342882, 0.6141230928162745, 0.28046819490669755], "isController": false}, {"data": ["https://api.e-valy.com/api/v1/ums/auth/logout", 80, 0, 0.0, 104.89999999999998, 77, 239, 97.0, 134.30000000000004, 179.50000000000003, 239.0, 0.6219969211152405, 0.4989946002892286, 0.4189671643937863], "isController": false}, {"data": ["https://api.e-valy.com/api/v1/ums/consumers/campaign/live", 300, 0, 0.0, 151.57666666666674, 70, 837, 100.0, 301.90000000000003, 428.29999999999984, 807.9200000000001, 1.5132637568286027, 1.24735888184941, 0.9876607527478347], "isController": false}, {"data": ["https://evaly.com.bd/products/nokia-c2-smartphone-3gb-ram-32gb-rom-5mp-camera-5.7%22inch-display-1880619", 40, 0, 0.0, 214.64999999999992, 101, 804, 180.5, 369.4, 674.349999999999, 804.0, 0.3100703084424393, 3.682319585106548, 0.24405924668418566], "isController": false}, {"data": ["https://api.e-valy.com/api/v1/cms/public/shops?page=1&search=flash%20sale&orderBy=score&orderDirection=DESC", 180, 0, 0.0, 117.91111111111117, 72, 522, 97.5, 166.9, 219.79999999999995, 519.5699999999999, 0.9092837874700694, 1.1824833108538175, 0.5018030971216116], "isController": false}, {"data": ["https://evaly.com.bd/about/terms-conditions", 80, 0, 0.0, 241.92499999999998, 88, 1318, 210.5, 397.9, 477.5, 1318.0, 0.5746631037554234, 25.566278858862745, 0.39872864767405114], "isController": false}, {"data": ["https://evaly.com.bd/products/pique-cotton-half-sleeve-polo-for-men-white-and-black-010-4952823", 20, 0, 0.0, 139.20000000000002, 99, 478, 114.5, 188.40000000000006, 463.6499999999998, 478.0, 0.3005394683456805, 3.1232184818624433, 0.2306875216012743], "isController": false}, {"data": ["Test", 20, 19, 95.0, 25854.149999999998, 21983, 28823, 26464.0, 28627.7, 28813.45, 28823.0, 0.5589871153469912, 1260.0246478381173, 50.55508949034349], "isController": true}, {"data": ["https://www.google-analytics.com/j/collect?v=1&_v=j101&a=1566095720&t=pageview&_s=1&dl=https%3A%2F%2Fevaly.com.bd%2F&ul=en-us&de=UTF-8&dt=Evaly%20%7C%20Online%20shopping%20platform&sd=24-bit&sr=1536x864&vp=1519x730&je=0&_u=QACAAUABAAAAACAAI~&jid=744947263&gjid=1469657933&cid=141729000.1698302517&tid=UA-121203268-1&_gid=541356295.1698302517&_r=1&gtm=457e3an0&gcd=11l1l1l1l1&jsscut=1&z=650625826", 20, 0, 0.0, 304.1, 128, 853, 331.0, 354.20000000000005, 828.0999999999997, 853.0, 0.2783693125669826, 0.11961181399362535, 0.22264108104722538], "isController": false}, {"data": ["https://evaly.com.bd/search", 40, 0, 0.0, 245.525, 100, 535, 211.5, 451.99999999999994, 520.1999999999999, 535.0, 1.3037384700629053, 15.812030450441641, 0.7269869789120302], "isController": false}, {"data": ["https://evaly.com.bd/shops", 100, 0, 0.0, 179.39000000000004, 95, 574, 157.0, 298.4000000000001, 360.4999999999999, 572.049999999999, 0.5058015437063114, 7.577791289528391, 0.28154968741464603], "isController": false}, {"data": ["https://api.e-valy.com/api/v1/ums/points/star", 80, 0, 0.0, 117.20000000000003, 77, 369, 98.0, 178.70000000000002, 286.2500000000001, 369.0, 0.6058953618710049, 0.5428798774576631, 0.396879212866188], "isController": false}, {"data": ["https://evaly.com.bd/search?page=1&categoryName=Smartphone", 40, 0, 0.0, 185.65000000000003, 102, 549, 135.5, 315.49999999999994, 359.1499999999999, 549.0, 0.3104336758451557, 4.758267661250892, 0.2719326242510787], "isController": false}, {"data": ["https://www.google-analytics.com/j/collect?v=1&_v=j101&a=1945709514&t=pageview&_s=1&dl=https%3A%2F%2Fevaly.com.bd%2F&ul=en-us&de=UTF-8&dt=Evaly%20%7C%20Online%20shopping%20platform&sd=24-bit&sr=1536x864&vp=1519x730&je=0&_u=QACAAUABAAAAACAAI~&jid=2065405523&gjid=1201262750&cid=141729000.1698302517&tid=UA-121203268-1&_gid=541356295.1698302517&_r=1&gtm=457e3an0&gcd=11l1l1l1l1&jsscut=1&z=1045135442", 20, 0, 0.0, 578.2500000000001, 490, 1182, 538.5, 742.6000000000003, 1160.6999999999998, 1182.0, 1.1048502927853276, 0.4747403601811954, 0.8858223538835488], "isController": false}, {"data": ["https://evaly.com.bd/about/return-refund", 80, 0, 0.0, 174.95000000000007, 86, 1144, 127.0, 311.70000000000016, 368.6500000000001, 1144.0, 0.5762235747470018, 11.976805594320595, 0.3979825422263838], "isController": false}, {"data": ["https://api.e-valy.com/api/v1/ums/auth/me", 100, 0, 0.0, 156.99000000000004, 76, 808, 129.0, 258.6000000000002, 305.7999999999997, 806.289999999999, 0.7572889057175312, 0.8695510696705793, 0.4586626751230594], "isController": false}, {"data": ["https://api.e-valy.com/api/v1/search/public/products/facets?page=1&limit=10", 400, 0, 0.0, 116.02250000000005, 67, 503, 102.0, 166.90000000000003, 198.64999999999992, 371.8100000000002, 3.0256270612084353, 12.024370835035247, 1.4970058110949744], "isController": false}, {"data": ["https://evaly.com.bd/categories", 100, 0, 0.0, 336.8600000000002, 84, 2829, 113.0, 1130.9, 1466.8, 2818.0799999999945, 0.5058168942842691, 54.854335601605975, 0.2970686330298432], "isController": false}, {"data": ["https://evaly.com.bd/products/t55-pro-max-smart-watch-with-earbud-black-6088553", 20, 0, 0.0, 184.2, 107, 776, 136.5, 286.9000000000001, 751.6999999999996, 776.0, 1.185255422543558, 11.930915350539292, 0.9954293587768165], "isController": false}, {"data": ["https://api.e-valy.com/api/v1/ums/address", 160, 0, 0.0, 152.56249999999994, 74, 710, 154.0, 223.70000000000002, 255.0, 592.2699999999974, 1.2232135348577633, 1.0173039322492603, 0.8116929657576661], "isController": false}, {"data": ["https://api.e-valy.com/api/v1/cms/public/products/flash%20sale/campaign-products?orderBy=score&orderDirection=DESC", 180, 0, 0.0, 115.10000000000005, 77, 431, 97.0, 174.40000000000003, 263.1999999999998, 372.67999999999984, 0.9091551927914095, 1.3481461441718101, 0.5097227518612427], "isController": false}, {"data": ["https://evaly.com.bd/shops/a-plus-for-super-flash-hour-cod-6939702", 40, 0, 0.0, 172.77500000000003, 104, 803, 126.0, 306.19999999999993, 435.1499999999999, 803.0, 0.3105107902499612, 3.4995005749301353, 0.27442604021114736], "isController": false}, {"data": ["https://evaly.com.bd/search?page=1&categoryName=Smartwatches", 20, 0, 0.0, 181.75000000000003, 109, 362, 189.5, 289.90000000000015, 358.74999999999994, 362.0, 1.1868027533823877, 14.876410255459293, 0.98166204308094], "isController": false}, {"data": ["https://evaly.com.bd/search?page=1&brandName=Individual%20Collection", 40, 0, 0.0, 195.75, 102, 1395, 126.5, 218.49999999999997, 1105.3499999999963, 1395.0, 0.30648522741203876, 3.4217324723971743, 0.2600934205283805], "isController": false}, {"data": ["https://evaly.com.bd/user/address", 40, 0, 0.0, 147.25, 91, 357, 118.5, 295.99999999999994, 329.65, 357.0, 0.3045924933180022, 0.9537998627430077, 0.17163073109813207], "isController": false}, {"data": ["https://evaly.com.bd/", 200, 0, 0.0, 409.8650000000001, 82, 1953, 370.5, 774.2000000000003, 1232.2499999999984, 1902.2000000000016, 0.9978048293753741, 87.20945268066504, 0.5828096157204151], "isController": false}, {"data": ["https://stats.g.doubleclick.net/j/collect?t=dc&aip=1&_r=3&v=1&_v=j101&tid=UA-121203268-1&cid=141729000.1698302517&jid=744947263&gjid=1469657933&_gid=541356295.1698302517&_u=QACAAUAAAAAAACAAI~&z=326954193", 20, 0, 0.0, 232.05, 81, 555, 249.5, 339.80000000000007, 544.4499999999998, 555.0, 0.2780519679128029, 0.1392975190813163, 0.19224686843971137], "isController": false}, {"data": ["https://stats.g.doubleclick.net/j/collect?t=dc&aip=1&_r=3&v=1&_v=j101&tid=UA-121203268-1&cid=141729000.1698302517&jid=2065405523&gjid=1201262750&_gid=541356295.1698302517&_u=QACAAUAAAAAAACAAI~&z=768783138", 20, 0, 0.0, 410.4, 334, 633, 393.0, 469.3, 624.8499999999999, 633.0, 1.159151501101194, 0.5807077344383911, 0.8025765764460414], "isController": false}, {"data": ["https://evaly.com.bd/orders", 40, 0, 0.0, 146.225, 97, 648, 118.0, 219.39999999999998, 273.34999999999997, 648.0, 0.30419176248707186, 0.8143219423024274, 0.169622555058709], "isController": false}, {"data": ["https://evaly.com.bd/search?page=1&brandName=NOKIA", 40, 0, 0.0, 151.90000000000003, 101, 441, 121.5, 270.9, 334.7, 441.0, 0.31047463810299997, 2.8442690747855783, 0.26954292311871775], "isController": false}, {"data": ["https://evaly.com.bd/auth/login", 40, 0, 0.0, 169.55, 89, 535, 120.0, 306.5, 376.94999999999976, 535.0, 0.2973712382538361, 3.1501313544516476, 0.19573067830379445], "isController": false}, {"data": ["https://evaly.com.bd/search?page=1&categoryName=Polo", 20, 0, 0.0, 132.95, 100, 259, 117.0, 203.60000000000005, 256.34999999999997, 259.0, 0.30060270843040293, 3.1085226269294934, 0.2556884365653134], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["429/Too Many Requests", 31, 100.0, 1.0689655172413792], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2900, 31, "429/Too Many Requests", 31, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://api.e-valy.com/api/v1/ums/auth/login-email", 80, 31, "429/Too Many Requests", 31, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
