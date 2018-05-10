var ScanApi = require('./scanApi');
var safe= true; // if "true" all data return with htmlspecialchars. Default - "true"
var diff = false;// if "true" then return return difference between real 
            // cache and master copy and if no actual master copy? then return error.
            // if "false" then return current data
var cache = true;// use cache or rescan each time
var url ='google.com'; //site to check
var key = '6123904782a42eb5001df809f2497508';
var url_api = 'http://revapi.ru/api.php';
var  api  = new ScanApi(key, url_api);
console.log(api.getStat());
 // var revizorroUserStatRequestResult = $api->getStat();
 // var revizorroRequestResult         = $api->scanURL($url, $cache, $diff);