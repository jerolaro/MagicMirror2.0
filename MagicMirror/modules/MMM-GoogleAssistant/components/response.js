class AssistantResponse{constructor(t,e){this.config=t,this.callbacks=e,this.newChime=t.newChime,this.showing=!1,this.response=null,this.aliveTimer=null,this.allStatus=["hook","standby","reply","error","think","continue","listen","confirmation"],this.myStatus={actual:"standby",old:"standby"},this.loopCount=0,this.chime={beep:this.newChime?"beep.mp3":"Old/beep.mp3",error:this.newChime?"error.mp3":"Old/error.mp3",continue:this.newChime?"continue.mp3":"Old/continue.mp3",open:"Google_beep_open.mp3",close:"Google_beep_close.mp3"},this.config.useNative||(this.audioResponse=new Audio,this.audioResponse.autoplay=!0,this.audioResponse.addEventListener("ended",()=>{log("audio end"),this.end()}),this.audioChime=new Audio,this.audioChime.autoplay=!0),this.fullscreenAbove=!1}tunnel(t){if("TRANSCRIPTION"==t.type){var e=!1;if(t.payload.done)this.status("confirmation"),document.getElementById("GA_SCREENOUTPUT").src="about:blank";t.payload.transcription&&!e&&(this.showTranscription(t.payload.transcription),e=!0)}}doCommand(t,e,s){}playChime(t,e){this.config.useChime&&(this.config.useNative?this.callbacks.sendSocketNotification("PLAY_CHIME","resources/"+(e?t:this.chime[t])):this.audioChime.src="modules/MMM-GoogleAssistant/resources/"+(e?t:this.chime[t]))}status(t,e){this.myStatus.actual=t;var s=document.getElementById("GA_STATUS");e&&"continue"!=this.myStatus.old&&this.playChime("beep"),"error"!=t&&"continue"!=t||this.playChime(t),"WAVEFILE"!=t&&"TEXT"!=t||(this.myStatus.actual="think"),"MIC"==t&&(this.myStatus.actual="continue"==this.myStatus.old?"continue":"listen"),this.myStatus.actual!=this.myStatus.old&&(this.callbacks.myStatus(this.myStatus),this.callbacks.sendNotification("ASSISTANT_"+this.myStatus.actual.toUpperCase()),log("Status from "+this.myStatus.old+" to "+this.myStatus.actual),s.className="hook"==this.myStatus.old?"hook":this.myStatus.actual,this.myStatus.old=this.myStatus.actual)}prepare(){var t=document.createElement("div");t.id="GA",t.className="out",this.config.screenRotate&&t.classList.add("rotate");var e=document.createElement("div");e.id="GA_CONTENER";var s=document.createElement("div");s.id="GA_STATUS",e.appendChild(s);var i=document.createElement("div");i.id="GA_TRANSCRIPTION",e.appendChild(i);var o=document.createElement("div");o.id="GA_LOGO",e.appendChild(o),t.appendChild(e),document.body.appendChild(t);var a=document.createElement("div");a.id="GA_HELPER",a.classList.add("hidden"),this.fullscreenAbove&&a.classList.add("fullscreen_above");var n=document.createElement("div");n.id="GA_RESULT_WINDOW";var l=document.createElement("iframe");l.id="GA_SCREENOUTPUT",n.appendChild(l),a.appendChild(n),document.body.appendChild(a)}modulePosition(){MM.getModules().withClass("MMM-GoogleAssistant").enumerate(t=>{"fullscreen_above"===t.data.position&&(this.fullscreenAbove=!0)})}showError(t){return this.showTranscription(t,"error"),this.status("error"),!0}showTranscription(t,e="transcription"){var s=document.getElementById("GA_TRANSCRIPTION");s.innerHTML="";var i=document.createElement("p");i.className=e,i.innerHTML=t,s.appendChild(i)}end(){if(this.showing=!1,this.response){var t=this.response;this.response=null,t&&t.continue?(this.loopCount=0,this.status("continue"),log("Continuous Conversation"),this.callbacks.assistantActivate({type:"MIC",profile:t.lastQuery.profile,key:null,lang:t.lastQuery.lang,useScreenOutput:t.lastQuery.useScreenOutput,force:!0},Date.now())):(log("Conversation ends."),this.status("standby"),this.callbacks.endResponse(),clearTimeout(this.aliveTimer),this.aliveTimer=null,this.aliveTimer=setTimeout(()=>{this.stopResponse(()=>{this.fullscreen(!1,this.myStatus)})},this.config.screenOutputTimer))}else this.status("standby"),this.fullscreen(!1,this.myStatus),this.callbacks.endResponse()}start(t){if(this.response=t,clearTimeout(this.aliveTimer),this.aliveTimer=null,this.showing&&this.end(),t.error)return"TRANSCRIPTION_FAILS"==t.error?(log("Transcription Failed. Re-try with text"),void this.callbacks.assistantActivate({type:"TEXT",profile:t.lastQuery.profile,key:t.transcription.transcription,lang:t.lastQuery.lang,useScreenOutput:t.lastQuery.useScreenOutput,force:!0,chime:!1},null)):"NO_RESPONSE"==t.error&&"continue"==t.lastQuery.status&&this.loopCount<3?(this.status("continue"),this.callbacks.assistantActivate({type:"MIC",profile:t.lastQuery.profile,key:null,lang:t.lastQuery.lang,useScreenOutput:t.lastQuery.useScreenOutput,force:!0},Date.now()),this.loopCount+=1,void log("Loop Continuous Count: "+this.loopCount+"/3")):(this.showError(this.callbacks.translate(t.error)),void this.end());var e=t=>{this.showing=!0,this.callbacks.A2D(t),this.status("reply");this.showScreenOutput(t);this.playAudioOutput(t)?log("Wait audio to finish"):(log("No response"),this.end())};this.postProcess(t,()=>{t.continue=!1,this.end()},()=>{e(t)})}stopResponse(t=(()=>{})){this.showing=!1,document.getElementById("GA_HELPER").classList.add("hidden"),this.config.useNative||(this.audioResponse.src=""),document.getElementById("GA_TRANSCRIPTION").innerHTML="",t()}postProcess(t,e=(()=>{}),s=(()=>{})){this.callbacks.postProcess(t,e,s)}playAudioOutput(t){return!(!t.audio||!this.config.useAudioOutput)&&(this.showing=!0,this.config.useNative?this.callbacks.sendAudio(t.audio.path):this.audioResponse.src=this.makeUrl(t.audio.uri),!0)}showScreenOutput(t){return!(this.sercretMode||!t.screen||!this.config.useScreenOutput)&&(t.audio||this.showTranscription(this.callbacks.translate("NO_AUDIO_RESPONSE")),this.showing=!0,document.getElementById("GA_SCREENOUTPUT").src=this.makeUrl(t.screen.uri),document.getElementById("GA_HELPER").classList.remove("hidden"),!0)}makeUrl(t){return"/modules/MMM-GoogleAssistant/"+t+"?seed="+Date.now()}fullscreen(t,e){var s=document.getElementById("GA");document.getElementById("GA_DOM");t?(s.className="in",this.fullscreenAbove?this.config.screenRotate?s.classList.add("rotate_above"):s.classList.add("fullscreen_above"):this.config.screenRotate&&s.classList.add("rotate"),this.fullscreenAbove&&(MM.getModules().exceptWithClass("MMM-GoogleAssistant").enumerate(t=>{t.hide(500,{lockString:"GA_LOCKED"})}),MM.getModules().withClass("MMM-GoogleAssistant").enumerate(t=>{t.show(500,{lockString:"GA_LOCKED"})}))):e&&"standby"==e.actual&&(s.className="out",this.fullscreenAbove?this.config.screenRotate?s.classList.add("rotate_above"):s.classList.add("fullscreen_above"):this.config.screenRotate&&s.classList.add("rotate"),this.fullscreenAbove&&(MM.getModules().exceptWithClass("MMM-GoogleAssistant").enumerate(t=>{t.show(500,{lockString:"GA_LOCKED"})}),MM.getModules().withClass("MMM-GoogleAssistant").enumerate(t=>{t.hide(500,{lockString:"GA_LOCKED"})})))}}