var lang = 'ja-JP';
var langs =
[['日本語',          ['ja-JP']],
 ['English(United States)',       ['en-US']],
 ['Afrikaans',       ['af-ZA']],
 ['Bahasa Indonesia',['id-ID']],
 ['Bahasa Melayu',   ['ms-MY']],
 ['Català',          ['ca-ES']],
 ['Čeština',         ['cs-CZ']],
 ['Dansk',           ['da-DK']],
 ['Deutsch',         ['de-DE']],
 ['English(Australia)',           ['en-AU']],
 ['English(Canada)',              ['en-CA']],
 ['English(India)',               ['en-IN']],
 ['English(New Zealand)',         ['en-NZ']],
 ['English(South Africa)',        ['en-ZA']],
 ['English(United Kingdom)',      ['en-GB']],
 ['Español(Argentina)',           ['es-AR']],
 ['Español(Bolivia)',             ['es-BO']],
 ['Español(Chile)',               ['es-CL']],
 ['Español(Colombia)',            ['es-CO']],
 ['Español(Costa Rica)',          ['es-CR']],
 ['Español(Ecuador)',             ['es-EC']],
 ['Español(El Salvador)',         ['es-SV']],
 ['Español(España)',              ['es-ES']],
 ['Español(Estados Unidos)',      ['es-US']],
 ['Español(Guatemala)',           ['es-GT']],
 ['Español(Honduras)',            ['es-HN']],
 ['Español(México)',              ['es-MX']],
 ['Español(Nicaragua)',           ['es-NI']],
 ['Español(Panamá)',              ['es-PA']],
 ['Español(Paraguay)',            ['es-PY']],
 ['Español(Perú)',                ['es-PE']],
 ['Español(Puerto Rico)',         ['es-PR']],
 ['Español(República Dominicana)',['es-DO']],
 ['Español(Uruguay)',             ['es-UY']],
 ['Español(Venezuela)',           ['es-VE']],
 ['Euskara',         ['eu-ES']],
 ['Filipino',        ['fil-PH']],
 ['Français',        ['fr-FR']],
 ['Galego',          ['gl-ES']],
 ['Hrvatski',        ['hr_HR']],
 ['IsiZulu',         ['zu-ZA']],
 ['Islenska',        ['is-IS']],
 ['Italiano(Italia)',        ['it-IT']],
 ['Italiano(Svizzera)',      ['it-CH']],
 ['Lietuvių',        ['lt-LT']],
 ['Magyar',          ['hu-HU']],
 ['Nederlands',      ['nl-NL']],
 ['Norsk bokmål',    ['nb-NO']],
 ['Polski',          ['pl-PL']],
 ['Português(Brasil)',       ['pt-BR']],
 ['Português(Portugal)',     ['pt-PT']],
 ['Română',          ['ro-RO']],
 ['Slovenščina',     ['sl-SI']],
 ['Slovenčina',      ['sk-SK']],
 ['Suomi',           ['fi-FI']],
 ['Svenska',         ['sv-SE']],
 ['Tiếng Việt',      ['vi-VN']],
 ['Türkçe',          ['tr-TR']],
 ['Ελληνικά',       ['el-GR']],
 ['български',    ['bg-BG']],
 ['Pусский',         ['ru-RU']],
 ['Српски',          ['sr-RS']],
 ['Українська',   ['uk-UA']],
 ['한국어',            ['ko-KR']],
 ['中文(普通话,中国大陆)',  ['cmn-Hans-CN']],
 ['中文(普通话,香港)',      ['cmn-Hans-HK']],
 ['中文(台灣)',             ['cmn-Hant-TW']],
 ['中文(粵語,香港)',        ['yue-Hant-HK']],
 ['हिन्दी',            ['hi-IN']],
 ['ภาษาไทย',      ['th-TH']]];

var select = document.getElementById('select_language');
for (var i = 0; i < langs.length; i++) {
    var option = document.createElement('option');
    option.value = langs[i][1];
    option.innerHTML = langs[i][0];
    select.appendChild(option);
}

updateCountry();

function updateCountry() {
    var index = document.getElementById('select_language').selectedIndex;
    var val = document.getElementById('select_language').options[index].value;
    lang = val;
    console.log("select lang : " + lang);
}
//////////

var flag_recognition    = true;

checkBoxCheck();

function checkBoxCheck(){
    flag_recognition    = document.getElementById('recognition').checked;
    if(flag_recognition){
        console.log("recognition : OK");
    }
}
//////////
var flag_restart = false;

function startButton() {
    if (recognizing) {
        endRecog();
        return;
    }
    $("#onoffbutton").val("Stop Recognition");
    var sel = document.getElementById("select_language");
    sel.disabled = true;
    final_transcript = '';
    recognition.lang = lang;
    recognition.start();
    ignore_onend = false;
}

function endRecog() {
    $("#onoffbutton").val("Start Recognition");
    var sel = document.getElementById("select_language");
    sel.disabled = false;
    recognition.stop();
}

function restartRecog() {
    console.log('restart recognition.');
    startButton();
    flag_restart = false;
}

function restart(){
    setTimeout(restartRecog(), 100);
}
//restart();
////////////
var xhr = null;
var http_url    = "http://127.0.0.1:25000/";

function http_connect(){
    http_url = document.getElementById('http_url').value.trim();

    // 接続テスト
    try {
        xhr = new XMLHttpRequest();
        xhr.onerror = function(e){
            alert("onerror: Connect Error");
            xhr = null;
            document.getElementById('http_btn').value = "Connect HTTP";
        };
        xhr.open('GET', http_url);
        xhr.send(null);
        xhr.abort();

        document.getElementById('http_btn').value = "Disconnect HTTP";
        $("#http_url").prop('disabled', true);
        return true;
    } catch(error) {
        alert("Connect Error: Check server address");
        console.log("Connect Error: Check server address");
        http_disconnect();
        return false;
    }
}

function http_disconnect(){
    if(xhr != null) {
        xhr.abort();
        xhr = null;
    }
    document.getElementById('http_btn').value = "Connect HTTP";
    $("#http_url").prop('disabled', false);
}

function http_set(btn){
    if(btn.value === "Connect HTTP") {
        btn.value = "Connecting";
        http_connect();
    } else {
        http_disconnect();
    }
}

function checkHTTPConnect(){
    // Connecting
    if(document.getElementById('http_btn').value == "Disconnect HTTP"){
        if(xhr == null){
            return http_connect();
        }
        return true;
    }
    // not connect
    else{
        http_disconnect();
        return false;
    }
}

///////////////

var ws = null;
var ws_url = "ws://127.0.0.1:24000/ws";

function ws_connect(){
    ws_url = document.getElementById('ws_url').value.trim();

    // 接続テスト
    try {
        ws = new WebSocket(ws_url);
        // 接続時
        //ws.onopen = function () {
        //    ws.send('test text send'); // Send the message 'Ping' to the server
        //};
        // サーバからのメッセージ受信
        ws.onmessage = function (e) {
            console.log('Server: ' + e.data);
            if(e.data === "en"){
                document.getElementById('select_language').selectedIndex = 1;
                updateCountry();
                console.log(lang);
                startButton();
            }
            else if(e.data === "jp"){
                document.getElementById('select_language').selectedIndex = 0;
                updateCountry();
                console.log(lang);
                startButton();
            }
            else if(e.data === "stop"){
                console.log('Stop recognition');
                endRecog();
            }
        };

        document.getElementById('ws_btn').value = "Disconnect WebSocket";
        $("#ws_url").prop('disabled', true);
        return true;
    } catch(error) {
        alert("Connect Error: Check server address");
        console.log("Connect Error: Check server address");
        ws_disconnect();
        return false;
    }
}

function ws_disconnect(){
    if(ws != null){
        ws.close();
        ws = null;
    }
    document.getElementById('ws_btn').value = "Connect WebSocket";
    $("#ws_url").prop('disabled', false);
}

function ws_set(btn){
    if(btn.value === "Connect WebSocket") {
        btn.value = "Connecting";
        ws_connect();
    } else {
        ws_disconnect();
    }
}

function checkWSConnect(){
    // Connecting
    if(document.getElementById('ws_btn').value == "Disconnect WebSocket"){
        if(ws == null){
            return ws_connect();
        }
        return true;
    }
    // not connect
    else{
        ws_disconnect();
        return false;
    }
}


var final_transcript = '';
var recognizing = false;
var ignore_onend = false;
var continue_flag = false;

var recognition = new webkitSpeechRecognition();

recognition.continuous = true;
recognition.interimResults = false;

recognition.onstart = function() {
    console.log('on start');
    if(flag_recognition){
        recognizing = true;
    }
};

recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
        ignore_onend = true;
        console.log("no-speech");
        endRecog();
        flag_restart = true;
    }
    if (event.error == 'audio-capture') {
        ignore_onend = true;
        console.log("audio-capture");
    }
    if (event.error == 'not-allowed') {
        ignore_onend = true;
        alert("Allow access to the microphone");
        console.log("not-allowed");
        endRecog();
    }
};

recognition.onend = function() {
    console.log('on end');
    recognizing = false;
    if(flag_restart){
        restart();
    }
    if (ignore_onend) {
        return;
    }
    if (!final_transcript) {
        return;
    }
};

recognition.onresult = function(event) {
    console.log('on result');
    if (typeof(event.results) == 'undefined') {
        console.log("undefined");
        endRecog();
        return;
    }

    for (var i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
            final_transcript = event.results[i][0].transcript;
            confidence = event.results[i][0].confidence;
            $("#result_text").val(final_transcript);
            $("#result_conf").val(confidence);

            if(checkHTTPConnect()) {
                try {
                    xhr.open('POST', http_url);
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xhr.send(final_transcript);
                } catch(error) {
                    alert("Send Error");
                    console.log("Send Error");
                    http_disconnect();
                }
            }
            if(checkWSConnect()){
                try {
                    ws.send(final_transcript);
                } catch(error) {
                    alert("Send Error");
                    console.log("Send Error");
                    ws_disconnect();
                }
            }
        }
    }
    if(!continue_flag){
        endRecog();
    }
};
