var status = '';
var strStatus = '';
var error_message = '';
var request_id = '';
var data = new Array();

class ScanResult{

	constructor(data)
    {
         this.RVZR_STATUS_COMPLETE = 'complete';
         this.RVZR_STATUS_INCOMPLETE = 'incomplete';
         this.RVZR_STATUS_ERROR = 'failed';
         this.RVZR_STATUS_CANCEL = 'canceled';
         this.RVZR_STATUS_QUEUED = 'queued';
        
         this.RVZR_ERROR_STATUS_LIMIT_TASK = 'LIMIT_TASK';
        
         this.RVZR_UA_MOBILE = 'UA_MOBILE';
         this.RVZR_UA_DESKTOP = 'UA_DESKTOP';
         this.RVZR_REF_SERP = 'REF_SERP';
         this.RVZR_REF_SUBPAGE = 'REF_SUBPAGE';
         this.RVZR_REF_SOCIAL = 'REF_SOCIAL';
        
         this.RVZR_ADDED = 1;
         this.RVZR_REMOVED = -1;
        
         this.RVZR_SCRIPT_URL = 'scriptUrls';
         this.RVZR_IFRAME_URL = 'iframes';
         this.RVZR_BACKGROUND_LOAD_URL = 'sideFrames';
         this.RVZR_OBJECT_URL = 'objects';
         this.RVZR_EXTERNAL_LINK_URL = 'exLinks';
         this.RVZR_EXTERNAL_RESOURCE_URL = 'externalResources';
         this.RVZR_LOAD_ERROR_URL = 'errorLoads';
         this.RVZR_PAGE_URL = 'page';

         this.RVZR_EXTERNAL_RESOURCE_OBJECT = 'objectsList';
         this.RVZR_EXTERNAL_RESOURCE_EMBED = 'embedsList';
         this.RVZR_EXTERNAL_RESOURCE_APPLET = 'appletsList';
         this.RVZR_EXTERNAL_RESOURCE = 'resourceList';
        
         this.RVZR_BLACKLISTED_URL = 'blackurl';
         this.RVZR_SIGNATURE = 'signature';
        
         this.RVZR_FAILED2CHECK = 'fail';
         console.log(data);
       
    	if(!(Array.isArray(data))){
    		this.status = this.RVZR_STATUS_ERROR;
            this.error_message = 'Revizorro server not response';
            return;
    	}
    	if(data['response_code']){
    		this.status = this.RVZR_STATUS_ERROR;
            this.error_message = data['response_text'] ? data['response_text'] : '';
            return;
    	}
        if(data['request_id']) {
            this.request_id = data['request_id'];
        }
        var status_array = [];
        status_array["RVZR_STATUS_COMPLETE"] = this.RVZR_STATUS_COMPLETE;
        status_array["RVZR_STATUS_INCOMPLETE"] = this.RVZR_STATUS_INCOMPLETE;
        status_array["RVZR_STATUS_QUEUED"] = this.RVZR_STATUS_QUEUED;
        status_array["RVZR_STATUS_CANCEL"] = this.RVZR_STATUS_CANCEL;
        status_array["RVZR_STATUS_ERROR"] = this.RVZR_STATUS_ERROR;
        var n = status_array.indexOf(data['status']);
        if((data['status'] && n !=-1)) {
            this.status = data['status'];
            this.error_message = data['errorMessage'] ? data['errorMessage'] : '';
            this.strStatus = data['strStatus'] ? data['strStatus'] : '';
            this.data = data;
        }
        else {
            this.status = this.RVZR_STATUS_ERROR;
        }
        if (this.status === this.RVZR_STATUS_COMPLETE) {
            this.data = data;
        }
    }

    getStatus()
    {
        return this.status;
    }

    getStrStatus()
    {
        return this.strStatus;
    }

    getErrorMessage()
    {
        return this.error_message;
    }

    getRequestID()
    {
        return this.request_id;
    }
    
    getRawData()
    {
        return this.data;
    }
    
    getUserBalance()
    {
        if (this.data['balance']) {
            return false;
        }
        return this.data['balance'];
    }

    getTasksInProgress()
    {
        if (this.data['tasks_in_progress']) {
            return false;
        }
        return this.data['tasks_in_progress'];
    }
    
    getActiveRequestPerHour()
    {
        if (this.data['active_requests_per_hour']) {
            return false;
        }
        return this.data['active_requests_per_hour'];
    }
    
    getMaxRequestsPerHour()
    {
        if (this.data['max_requests_per_hour']) {
            return false;
        }
        return this.data['max_requests_per_hour'];
    }

    getMaxQueued()
    {
        if (this.data['queue_length']) {
            return false;
        }
        return this.data['queue_length'];
    }

    getTasksInQueue()
    {
        if (this.data['queued']) {
            return false;
        }
        return this.data['queued'];
    }
            
    getUrl() {
        if (this.data['url']) {
            return false;
        }
        return this.data['url'];
    } 
    
    getExecTime() 
    {
        if (this.data['exec_time']) {
            return false;
        }
        return this.data['exec_time'];
    }

    getReady() 
    {
        if (this.data['ready']) {
            return false;
        }
        return this.data['ready'];
    }

    
    getIP() {
        if (typeof this.data === 'undefined') {
            return false;
        }else{
            return this.data['misc']['ip'];
        }
        
    }
    
    getDNS() {
        if (typeof this.data === 'undefined') {
            return false;
        }
        return this.data['misc']['dns'];
    }
    
    getCMS() {
        if (typeof this.data === 'undefined') {
            return false;
        }
        return this.data['misc']['cms'];
    }
    
    
    cachedResult()
    {
        if (typeof this.data !== 'undefined' && this.data!== 'undefined') {
            if (typeof this.data['cached_result'] !== 'undefined' && this.data['cached_result']) {
              return true;
            }
        }
        
        return false;
    }

    cacheCreateTime()
    {
        if (typeof this.data !== 'undefined') {
            if (this.data['cache_create_time']) {
                return this.data['cache_create_time'];
            }
        }
        return 0;
    }

    masterCopyCacheCreateTime()
    {
        if (typeof this.data !== 'undefined') {
            if (this.data['master_copy_cache_create_time']) {
                return this.data['master_copy_cache_create_time'];
            }
        }
        return 0;
    }
    


   getResponseErrors()
    {
        if (typeof this.data === 'undefined') {
            return new Array();
        }
        return this.data['result']['page_response_errors'];
    }

    gotBlacklisted()
    {
        if (typeof this.data !== 'undefined') {
            if (this.data['result']['blacklisted'] !== 'undefined' && (this.data['result']['blacklisted']).length()) {
                return true;
            }
        }
        return false;
    }
    
    getBlackLists()
    {
        if (!(this.data['result']['blacklisted'])) {
            return new Array();
        }
        return this.data['result']['blacklisted'];
    }

    getMalwareInHTML()
    {
         if (typeof this.data === 'undefined') {
                return new Array();
        }else{
            return this.data['result']['html_malware'];
        }
        
    }

    getMalwareInFiles()
    {
        if (typeof this.data === 'undefined') {
            return new Array();
        }
        return this.data['result']['files_malware'];
    }

    getBlacklistedUrls()
    {
        if (typeof this.data === 'undefined') {
            return new Array();
        }
        return this.data['result']['blacklisted_urls'];
    }

    hasRedirect()
    {
        if ((typeof this.data !=='undefined')) {
            return true;
        }
        return false;
    }
    
    getRedirects()
    {
        if (!(this.data['result']['redirects'])) {
            return new Array();
        }
        return this.data['result']['redirects'];
    }
    
    
    getSuspiciousUrls()
    {
        if (!(this.data['result']['suspicious_urls'])) {
            return array();
        }
        return this.data['result']['suspicious_urls'];
    }

    getResourcesErrors()
    {
        if (!(this.data['result']['resources_errors'])) {
            return array();
        }
        return this.data['result']['resources_errors'];
    }

    getExternalResources()
    {
        if (!(this.data['result']['external_resources'])) {
            return array();
        }
        return this.data['result']['external_resources'];
    }

    getExternalLinks()
    {
        if (!(this.data['result']['external_links'])) {
            return array();
        }
        return this.data['result']['external_links'];
    }

    getIssues()
    {
        if (!(this.data['result']['issues'])) {
            return array();
        }
        return this.data['result']['issues'];
    }
    
    isDiff()
    {
        if (typeof this.data !== 'undefined') {
            if (!(this.data['result']['diff'])) {
                return array();
            }
            return this.data['result']['diff'];
        }
        
    }
    
    getMonitoring()
    {
        if (!(this.data['monitoring'])) {
            return array();
        }
        return this.data['monitoring'];
    }
}

module.exports=ScanResult;