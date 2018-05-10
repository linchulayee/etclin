
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


class ScanApi {

	constructor(key_api, url_api = URL_API_BASIS) {
	    this._key_api = key_api;
	    this._url_api = url_api;
	}

	getResponseJSON()
    {
        return this._response_json;
    }
    scanURL(URL, cache = true, diff = false, paranoid = false)
    {
        full_url = this.prepare_url(URL);
        if (full_url === false) {
            return false;
        }else{
        	var parameters = {'url':full_url, 'cache':cache, 'diff':diff,'paranoid':paranoid};
        }
        return new ScanResult(this._doCall(this.URL_ACTION_CREATE, parameters));
    }

   
    scanURL(URL, cache = true, diff = false, paranoid = false)
    {
        full_url = this.prepare_url(URL);
        if (full_url === false) {
            return false;
        }else{
        	var parameters = {'url':full_url, 'cache':cache, 'diff':diff,'paranoid':paranoid};
        }        
        return new ScanResult(this._doCall(URL_ACTION_CREATE, parameters));
    }
    
    getURLReport(request_id, safe = true)
    {
    	var parameters = {'request_id':request_id,'safe':safe};
       
        return new ScanResult(this._doCall(URL_ACTION_REPORT, parameters));
    }

    setAcknowledge(URL)
    {
        full_url = this.prepare_url(URL);
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
        var url = this._url_api + '?api_ver=' +VERSION + '&key=' + this._key_api + '&action=' + apiTarget;
        if (parameters) {
        	for (var key in parameters) {
			       // console.log(key + " -> " + parameters[key]);
			        url += '&' + key + '=' + urlencode(parameters[key]);
			}
			console.log(url);
            // foreach (parameters as field_name => value) 
            // {
            //     $url .= '&' . $field_name . '=' . urlencode($value);
            // }
        }
        // $ch = curl_init($url);
        
        // curl_setopt($ch, CURLOPT_HTTP_VERSION,   CURL_HTTP_VERSION_1_0);
        // curl_setopt($ch, CURLOPT_FORBID_REUSE,   1);
        // curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        // curl_setopt($ch, CURLOPT_VERBOSE,        0);
        // curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        // curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        // curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        
        // $response = curl_exec($ch);
        // $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        // curl_close($ch);

        // $this->_response_json = $response;
        // if ($httpCode != '200') {
        //     return array(
        //         'response_code' => -1,
        //         'response_text' => 'HTTP return code:' . $httpCode
        //     );
        // }

        // $data = json_decode($response, true);
        // if (json_last_error()) {
        //     return array(
        //         'response_code' => -2,
        //         'response_text' => 'JSON error:' . json_last_error_msg().$response
        //     );
        // }
        // return $data;
    }
    
}

module.exports = ScanApi;