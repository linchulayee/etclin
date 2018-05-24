var ScanApi = require('./scanApi');
const ScanResult = require('./ScanResult');
var safe= true; // if "true" all data return with htmlspecialchars. Default - "true"
var diff = false;// if "true" then return return difference between real 
            // cache and master copy and if no actual master copy? then return error.
            // if "false" then return current data
var cache = true;// use cache or rescan each time
var url ='https://google.com'; //site to check
var key = '6123904782a42eb5001df809f2497508';
var url_api = 'http://revapi.ru/api.php';
var  api  = new ScanApi(key, url_api);
var scan  = new ScanResult();
//console.log(api.scanURL(url));
//var revizorroUserStatRequestResult = api.getStat();
//console.log(revizorroUserStatRequestResult);
var revizorroRequestResult         = api.scanURL(url, cache, diff);
if (revizorroRequestResult == 'false') {
 	var data_array =[];
    //console.log('Wrong url(' + $url +')' + "\n");
    data_array['status'] =500;
    data_array['message'] = "Wrong url " . url;
    return data_array;
}
if (revizorroRequestResult.getStatus() == scan.RVZR_STATUS_ERROR) {
	var data_array=[];
    // echo($revizorroRequestResult->getStrStatus() . ' (' . $revizorroRequestResult->getErrorMessage() . ')' . "\n");
    data_array['status'] =revizorroRequestResult.getStrStatus();
    data_array['message'] = revizorroRequestResult.getErrorMessage();
    console.log(data_array);
    return data_array;

}

request_id  = revizorroRequestResult.getRequestID();
in_progress = true;
i           = 0;
data_array = [];

while (in_progress) {
	revizorroResult = api.getURLReport(request_id, safe);
	i++;
	if (revizorroResult.getStatus() === ScanResult.RVZR_STATUS_ERROR
	        || revizorroResult.getStatus() === ScanResult.RVZR_STATUS_CANCEL) {
	    data_array['status'] =revizorroResult.getStrStatus();
	    data_array['message'] =revizorroResult.getErrorMessage();
	    console.log(data_array);
	    // echo $revizorroResult->getStrStatus() . ' (' . $revizorroResult->getErrorMessage() . ')' . "\n";
	} else if (checkArrayData()) {
	    // echo '\rChecking $url [' . $i . '] [status:' . $revizorroResult->getStatus() . '] ' . $revizorroResult->getExecTime() . 's ' . $revizorroResult->getReady() . '%  ...             ';
	    //array
	    data_array['status'][i] =revizorroResult.getStatus()+"  " + revizorroResult.getExecTime() +'s ' + revizorroResult.getReady() + '%';
	    // setTimeout(function(){
	    // 	continue; 
	    // }, 2000);
	}
	in_progress = false;
}
function checkArrayData()
{
	var testArry = [];
	testArry.push(ScanResult.RVZR_STATUS_INCOMPLETE);
	testArry.push(ScanResult.RVZR_STATUS_QUEUED);
	var data = revizorroResult.getStatus();
	function inArray(testArry, data) {
	    var length = data.length;
	    for(var i = 0; i < length; i++) {
	        if(data[i] == testArry) return true;
	    }
	    return false;
	}
}

// /////////////////////////////////////////////////
// Print out results
// /////////////////////////////////////////////////
//cachedResult
cachedResult = revizorroResult.cachedResult();
//echo "Cached result: \n* ".($cachedResult ? 'true' : 'false')."\n\n";
data_array['cached_result'] = cachedResult ? 'true' : 'false';
//masterCopyCacheCreateTime
cacheCreateTime = revizorroResult.cacheCreateTime();
//echo "Cache create time: \n* " . date('Y.m.d G:i:s', $cacheCreateTime) . "\n\n";
//data_array['cache_create_time'] = date('Y.m.d G:i:s', cacheCreateTime);
//masterCopyCacheCreateTime
masterCopyCacheCreateTime = revizorroResult.masterCopyCacheCreateTime();
if (masterCopyCacheCreateTime) {
  //  #echo "Master copy cache create time: \n* " . date('Y.m.d G:i:s', $masterCopyCacheCreateTime) . "\n\n";
  //  $data_array['master_copy_cache_create_time'] = date('Y.m.d G:i:s', $masterCopyCacheCreateTime) ;
}
// isDiff
isDiff = revizorroResult.isDiff();
//echo "is Diff: \n* ".($isDiff ? 'true' : 'false')."\n\n";
data_array['is_Diff'] = (isDiff ? 'true' : 'false');
// Misc
ip = revizorroResult.getIP();
// echo "IP: $ip\n\n";
data_array['IP'] = ip;
dns = revizorroResult.getDNS();
//echo "DNS: " . implode(", ", $dns) . "\n\n";
console.log(dns);
console.log("jjjjjjjjj");
if(dns){
	data_array['DNS'] = dns.join(", ");

}
cms = revizorroResult.getCMS();
if(cms){
	//echo "CMS: " . implode(", ", $cms) . "\n\n";
	data_array['CMS'] = cms.join(", ");
}


// Page response errors
pageErrors = revizorroResult.getResponseErrors();
if (pageErrors) {
    //#echo "Reponse Errors:\n";
    resp_errors = [];
    // foreach ($pageErrors as $pageError) 
    // {
    //    //# echo "* " . implode("\t", $pageError) . "\n";
    //     array_push($resp_errors,implode("\t", $pageError));
        
    // }
    data_array['Reponse_Errors'] = pageErrors;
    //#echo "\n\n";
}
// If website is blacklisted in Yandex/Google/Virustotal
if (revizorroResult.gotBlacklisted()) {
	//#echo "Got Blacklisted:\n";
	blacklisted = [];
	blackLists = revizorroResult.getBlackLists();
	// foreach ($blackLists as $name => $info) {
	//     if (!is_array($info)) {
	//        # echo '* ' . $name . ": " . $info . "\n";
	//         array_push($blacklisted,'* ' . $name . ": " . $info);
	//     } else {
	//         #echo '* ' . $name . ": " . implode(', ', $info) . "\n";
	//         array_push($blacklisted,'* ' . $name . ": " . implode(', ', $info));
	//     }
	// }
	data_array['blacklisted'] = blackLists;

	//# echo "\n\n";
}

 // Malware in HTML Page
malwareInHTML = revizorroResult.getMalwareInHTML();
if (malwareInHTML) {
    html_alware = [];
  // # echo "Malware in HTML:\n";
    // foreach ($malwareInHTML as $signature)
    // {
    //     #echo "* " . implode(", ", $signature) . "\n";
    //     array_push($html_alware,"* " . implode(", ", $signature));
    // }
    data_array['html_alware'] = html_alware;
   // #echo "\n\n";
}
// Malware in JS
malwareInFiles = revizorroResult.getMalwareInFiles();
if (malwareInFiles) {
    js_malware =[];
  // # echo "Malware in JS:\n";
    // foreach ($malwareInFiles as $page => $signatures)
    // {
    //     foreach ($signatures as $signature)
    //     {
    //        # echo "* $page\n * " . implode(", ", $signature) . "\n";
    //         array_push($js_malware,"* " . implode(", ", $signature));
    //     }
    // }
    data_array['js_malware'] = malwareInFiles;
   // #echo "\n\n";
}
// Page resource with blacklisted URLs
blacklistedUrls = revizorroResult.getBlacklistedUrls();
if (blacklistedUrls) {
    url_backListed = [];
  // #  echo "Page resources with blacklisted URLs:\n";
  //   foreach ($blacklistedUrls as $line) {
  //     #  echo "* " . $line[0] . " " . $line[1] . "\n";
  //       array_push($url_backListed,"* " . $line[0] . " " . $line[1]);
  //   }
    data_array['url_backListed'] =blacklistedUrls;
   //# echo "\n\n";
}

// Redirects
if (revizorroResult.hasRedirect()) {
    redirects = [];
  // # echo "Redirects:\n";
    PageRedirects = revizorroResult.getRedirects();
    // foreach ($PageRedirects as $type => $redirects) {
    //   #  echo "* User Agent / Referer: " . $type . "\n";
    //     foreach ($redirects as $redirect) {
    //      #   echo "   * [ " . array_shift($redirect) . " ] " . implode(' -> ', $redirect) . "\n";
    //         array_push($redirects,"   * [ " . array_shift($redirect) . " ] " . implode(' -> ', $redirect));
    //     }
    // }
    // #echo "\n\n";
    data_array['redirects'] = PageRedirects;
}

 // Scripts loaded from unknown hosts
suspiciousUrls = revizorroResult.getSuspiciousUrls();
if (suspiciousUrls) {
    suspicious_urls = [];
   // # echo "Scripts loaded from unknown hosts:\n";
   //  foreach ($suspiciousUrls as $suspiciousUrl)
   //  {
   //     # echo "* " . implode("\t", $suspiciousUrl) . "\n";
   //      array_push($suspicious_urls,"* " . implode("\t", $suspiciousUrl));
   //  }
    data_array['suspicious_urls'] = suspiciousUrls;
  // # echo "\n\n";
}

// Resource load errors
resourcesErrors = revizorroResult.getResourcesErrors();
if (resourcesErrors) {
    resources_errors=[];
   // # echo "Resources errors:\n";
   //  foreach ($resourcesErrors as $errorLoad) {
   //    #  echo "* " . $errorLoad[0] . " " . $errorLoad[1] . "\n";
   //      array_push($resources_errors,"* " . $errorLoad[0] . " " . $errorLoad[1]);
   //  }
    data_array['resources_errors'] = resourcesErrorss;
  // # echo "\n\n";
}

// Resources loaded from other hosts
externalResources = revizorroResult.getExternalResources();
if (externalResources) {
    external_resources = [];
    // #echo "External Resources:\n";
    // foreach ($externalResources as $externalResource) {
    //   #  echo "* " . $externalResource[0] . " " . $externalResource[1] . "\n";
    //     array_push($external_resources,"* " . $externalResource[0] . " " . $externalResource[1] );
    // }
    data_array['external_resources'] = externalResources;
   // #echo "\n\n";
}

// External Links
externalLinks = revizorroResult.getExternalLinks();
if (externalLinks.length > 0) {
  // # echo "External Links:\n";
    $external_links= [];
    // foreach ($externalLinks as $page => $externalLinks) {
    //     echo $page . "\n";
    //     foreach ($externalLinks as $externalLink)
    //     {
    //        # echo '* ' . $externalLink[0] . "\t" . $externalLink[1] . "\t" . $externalLink[2] . "\t[" . implode(', ', $externalLink[3]) . ']' . "\n";
    //         array_push($external_links,'* ' . $externalLink[0] . "\t" . $externalLink[1] . "\t" . $externalLink[2] . "\t[" . implode(', ', $externalLink[3]) . ']' );
    //     }
    // }
    data_array['external_links'] = externalLinks;
}

// Issues
issues = revizorroResult.getIssues();
if (issues.length > 0) {
  // #echo "Issues:\n";
    $issues = [];
    // foreach ($issues as $page => $issue) {
    //   #  echo '* ' . $issue[0] . "\t[" . $issue[2] . "]\t" . $issue[1] . "\n";
    //     array_push($issues,'* ' . $issue[0] . "\t[" . $issue[2] . "]\t" . $issue[1]);
    // }
    $data_array['issues'] = issues;
}

 //#echo "\n[API Key stat]\n";
//# printf("  %-22s\t%-32s\n", 'Credits:', $revizorroUserStatRequestResult->getUserBalance());
data_array['credits'] = revizorroUserStatRequestResult.getUserBalance();
//# printf("  %-22s\t%-32s\n", 'Active Parallel Process:', $revizorroUserStatRequestResult->getTasksInProgress());
data_array['active_parallel_process'] = revizorroUserStatRequestResult.getTasksInProgress();
//#printf("  %-22s\t%-32s\n", 'Active Request Per Hour:', $revizorroUserStatRequestResult->getActiveRequestPerHour());
data_array['active_request_per_hour'] = revizorroUserStatRequestResult.getActiveRequestPerHour();
//#printf("  %-22s\t%-32s\n", 'Max Requests Per Hour:', $revizorroUserStatRequestResult->getMaxRequestsPerHour());
data_array['max_requests-per_hour'] = revizorroUserStatRequestResult.getMaxRequestsPerHour();
//#printf("  %-22s\t%-32s\n", 'Active Task in Queue:', $revizorroUserStatRequestResult->getTasksInQueue());
data_array['active_task_in_queue'] = revizorroUserStatRequestResult.getTasksInQueue();
//#printf("  %-22s\t%-32s\n", 'Max Task in Queue:', $revizorroUserStatRequestResult->getMaxQueued());
data_array['max_task_in_queue'] = revizorroUserStatRequestResult.getMaxQueued();
//#echo "\n\n";
console.log(data_array);