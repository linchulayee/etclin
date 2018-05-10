const RVZR_STATUS_COMPLETE = 'complete';
    const RVZR_STATUS_INCOMPLETE = 'incomplete';
    const RVZR_STATUS_ERROR = 'failed';
    const RVZR_STATUS_CANCEL = 'canceled';
    const RVZR_STATUS_QUEUED = 'queued';
    
    const RVZR_ERROR_STATUS_LIMIT_TASK = 'LIMIT_TASK';
    
    const RVZR_UA_MOBILE = 'UA_MOBILE';
    const RVZR_UA_DESKTOP = 'UA_DESKTOP';
    const RVZR_REF_SERP = 'REF_SERP';
    const RVZR_REF_SUBPAGE = 'REF_SUBPAGE';
    const RVZR_REF_SOCIAL = 'REF_SOCIAL';
    
    const RVZR_ADDED = 1;
    const RVZR_REMOVED = -1;
    
    const RVZR_SCRIPT_URL = 'scriptUrls';
    const RVZR_IFRAME_URL = 'iframes';
    const RVZR_BACKGROUND_LOAD_URL = 'sideFrames';
    const RVZR_OBJECT_URL = 'objects';
    const RVZR_EXTERNAL_LINK_URL = 'exLinks';
    const RVZR_EXTERNAL_RESOURCE_URL = 'externalResources';
    const RVZR_LOAD_ERROR_URL = 'errorLoads';
    const RVZR_PAGE_URL = 'page';

    const RVZR_EXTERNAL_RESOURCE_OBJECT = 'objectsList';
    const RVZR_EXTERNAL_RESOURCE_EMBED = 'embedsList';
    const RVZR_EXTERNAL_RESOURCE_APPLET = 'appletsList';
    const RVZR_EXTERNAL_RESOURCE = 'resourceList';
    
    const RVZR_BLACKLISTED_URL = 'blackurl';
    const RVZR_SIGNATURE = 'signature';
    
    const RVZR_FAILED2CHECK = 'fail';

    var status = '';
    var strStatus = '';
    var error_message = '';
    var request_id = '';
    var data = [];


class ScanResult{
	constructor(data)
    {
    	if(!(Array.isArray(data))){
    		this.status = RVZR_STATUS_ERROR;
            this.error_message = 'Revizorro server not response';
            return;
    	}
    	if(data['response_code']){
    		this.status = RVZR_STATUS_ERROR;
            this.error_message = data['response_text'] ? data['response_text'] : '';
            return;
    	}
        if(data['request_id']) {
            this.request_id = data['request_id'];
        }
        var status_array = [];
        status_array["RVZR_STATUS_COMPLETE"] = RVZR_STATUS_COMPLETE;
        status_array["RVZR_STATUS_INCOMPLETE"] = RVZR_STATUS_INCOMPLETE;
        status_array["RVZR_STATUS_QUEUED"] = RVZR_STATUS_QUEUED;
        status_array["RVZR_STATUS_CANCEL"] = RVZR_STATUS_CANCEL;
        status_array["RVZR_STATUS_ERROR"] = RVZR_STATUS_ERROR;
        var n = status_array.indexOf(data['status']);
        if((data['status'] && n !=-1)) {
            this.status = data['status'];
            this.error_message = data['errorMessage'] ? data['errorMessage'] : '';
            this.strStatus = data['strStatus'] ? data['strStatus'] : '';
            this.data = data;
        }
        else {
            this.status = RVZR_STATUS_ERROR;
        }
        if (this.status === RVZR_STATUS_COMPLETE) {
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
        if (this.data['misc']['ip']) {
            return false;
        }
        return this.data['misc']['ip'];
    }
    
    getDNS() {
        if (this.data['misc']['dns']) {
            return false;
        }
        return this.data['misc']['dns'];
    }
    
    getCMS() {
        if (this.data['misc']['cms']) {
            return false;
        }
        return this.data['misc']['cms'];
    }
    
    
    cachedResult()
    {
        if (this.data['cached_result'] && this.data['cached_result']) {
            return true;
        }
        return false;
    }

    cacheCreateTime()
    {
        if (this.data['cache_create_time']) {
            return this.data['cache_create_time'];
        }
        return 0;
    }

    masterCopyCacheCreateTime()
    {
        if (this.data['master_copy_cache_create_time']) {
            return this.data['master_copy_cache_create_time'];
        }
        return 0;
    }
    


   getResponseErrors()
    {
        if (this.data['result']['page_response_errors']) {
            return new array();
        }
        return this.data['result']['page_response_errors'];
    }

    gotBlacklisted()
    {
        if (this.data['result']['blacklisted'] && (this.data['result']['blacklisted']).length()) {
            return true;
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
        if (!(this.data['result']['html_malware'])) {
            return new Array();
        }
        return this.data['result']['html_malware'];
    }

    getMalwareInFiles()
    {
        if (!(this.data['result']['files_malware'])) {
            return new Array();
        }
        return this.data['result']['files_malware'];
    }

    getBlacklistedUrls()
    {
        if (!(this.data['result']['blacklisted_urls'])) {
            return new Array();
        }
        return this.data['result']['blacklisted_urls'];
    }

    hasRedirect()
    {
        if ((this.data['result']['redirects']) && (this.data['result']['redirects']).length()) {
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
        if (!(this.data['result']['diff'])) {
            return array();
        }
        return this.data['result']['diff'];
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