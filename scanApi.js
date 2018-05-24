
const ScanResult = require('./ScanResult');

const VERSION = '1.2.0';
const URL_API_BASIS = 'http://host/api.php';

const URL_ACTION_CREATE = 'check';
const URL_ACTION_REPORT = 'get_result';
const URL_ACTION_ACKNOWLEDGE = 'acknowledge';
const URL_ACTION_GET_STAT = 'get_stat';
const URL_ACTION_CANCEL = 'cancel';
var $_key_api;
var $_url_api;
var $_response_json = '';
const urlParse = require('url');
const async = require('async');
const axios = require('axios');
class ScanApi {

	constructor(key_api, url_api = URL_API_BASIS) {
	    this._key_api = key_api;
	    this._url_api = url_api;
	}

	getResponseJSON()
    {
        return this._response_json;
    }
  
   failureCallback(err){
        console.log(err);
   }
    scanURL(URL, cache = true, diff = false, paranoid = false)
    {

        var _this = this;
        const promise = _this.prepare_url(URL);
        promise.then(function(result) {
            var full_url = result;
            if (full_url === false) {
                console.log("hereeeeeeeeeeeee");
                return false;
            }else{
                var parameters = {'url':full_url, 'cache':cache, 'diff':diff,'paranoid':paranoid};
            }
           var promiseCall = _this._doCall(URL_ACTION_CREATE, parameters);
           
           console.log(promiseCall);
               promiseCall.then(function(res){
                    return new ScanResult(res);
               }).catch(function(err){
                    console.log(err);
               })
          // console.log('hekllooooooooooooooooo');
          // promiseCall.then(function(res){
          //   console.log(res);
          // }).catch(function(err){
          //   console.log(err);
          // })
          console.log("mmmmmmmmmmmmmmmmmmmmmmmm");
        }).catch(this.failureCallback);
       
        console.log('toooooooooooooo');    
        console.log(URL_ACTION_CREATE);
        //console.log(new ScanResult());
       // console.log(this._doCall(URL_ACTION_CREATE, parameters));    
        //return new ScanResult(this._doCall(URL_ACTION_CREATE, parameters));
        
    }
    __dicall(){
        return new Array();
    }
    getURLReport(request_id, safe = true)
    {
    	var parameters = {'request_id':request_id,'safe':safe};
       
        return new ScanResult(this._doCall(URL_ACTION_REPORT, parameters));
    }

    setAcknowledge(URL)
    {
        var full_url = this.prepare_url(URL);
        
        if (full_url === false) {
            return false;
        }
        var parameters = {"url":full_url};
       	result = this._doCall(URL_ACTION_ACKNOWLEDGE, parameters);
       	if(result.status == 'complete' ){
       		return true;
      	}else{
       		return false;
       	}
    }
    getStat()
    {
        return new ScanResult(this._doCall(URL_ACTION_GET_STAT));
    }

   	cancel(request_id)
    {
        var  parameters ={"request_id":request_id};
        return new ScanResult(this._doCall(URL_ACTION_CANCEL, parameters));
    }
    
    _doCall(apiTarget, parameters = [])
    {   
        var promise = new Promise((resolve, reject) => {
            var url = this._url_api + '?api_ver=' +VERSION + '&key=' + this._key_api + '&action=' + apiTarget;
            if (parameters) {
                async.forEach(Object.keys(parameters), function (item, callback){ 
                    url += '&' + item + '=' + encodeURI(parameters[item]);
                    // tell async that that particular element of the iterator is done
                    callback(); 
                }, function(err) {
                     if(err){
                        result['response_code']=-1;
                        result['response_text']=err;
                        reject(result);
                    }else{
                        resolve(url);
                    }
                });
            }
        });

        var finalPromise = promise.then(function(urlres){
           return new Promise((resolve, reject) => {
                var result  = new Array();
                axios.post(urlres)
                  .then(function (response) {
                    resolve(response);
                })
                .catch(function (error) {
                    if (error.response.status != '200') {
                        console.log('jjjjjjjjjjj');
                        result['response_code']=-1;
                        result['response_text']=error.response.data;
                        resolve(result);
                    }
                    if (error.response) {
                      // The request was made and the server responded with a status code
                      // that falls out of the range of 2xx
                        result['response_code']=-1;
                        result['response_text']=error.response.data;
                        resolve(result);
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        //console.log(error.request);
                        result['response_code']=-1;
                        result['response_text']=error.request;
                        resolve(result);
                    } else {
                      // Something happened in setting up the request that triggered an Error
                        console.log('jhhhhhhhhhhhhhhhhhhhh');
                        console.log('Error', error.message);
                        result['response_code']=-1;
                        result['response_text']=error.message;
                        resolve(result);
                    }
                });
            });
        }).catch(function(err){
            console.log(err);
            console.log('erorrrrrrr');
        });       
        return finalPromise;
    }
    
    prepare_url(url)
    {
        return new Promise((resolve, reject) => {
            if (!url) {
                console.log('haii');
                resolve(false);
            }

            if (url.indexOf('//') === 0) {
                url = 'http:' + url;
            }

            if (url.indexOf('http') !== 0) {      
                url = 'http://' + url;
            }
            const regex = /^(https?)?(:\/\/)?([^/]+)/i;
            let m;

            if ((m = regex.exec(url)) !== null) {
                // The result can be accessed through the `m`-variable.
                if(!m[3]){
                    console.log('no');
                    resolve(false);
                }
            }else{
                console.log('yew');
                resolve(false);
            }
                   
            var url_data = urlParse.parse(url, true);
            if (url_data === false || !url_data.protocol || url_data.protocol ===null){
                resolve(false);
                 
            }
            if (!url_data.host || url_data.host === null) {
                resolve(false);
                
            }
            const regex1 = /\.{2,}/;

            url = url.replace(regex1, '.');
            url = url.replace('/[\x00-\x1F\x7F]/','');
            resolve(url.toLowerCase());
        })
    }    
}

module.exports = ScanApi;