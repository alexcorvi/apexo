(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[14],{

/***/ "./node_modules/react-avatar-editor/dist/index.js":
/*!********************************************************!*\
  !*** ./node_modules/react-avatar-editor/dist/index.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("!function(e,t){ true?module.exports=t(__webpack_require__(/*! prop-types */ \"./node_modules/prop-types/index.js\"),__webpack_require__(/*! react */ \"./node_modules/react/index.js\"),__webpack_require__(/*! react-dom */ \"./node_modules/react-dom/index.js\")):undefined}(this,function(e,t,o){\"use strict\";function n(e,t){return new Promise(function(o,n){var i,a=new Image;a.onload=function(){return o(a)},a.onerror=n,!1==(null!==(i=e)&&!!i.match(/^\\s*data:([a-z]+\\/[a-z]+(;[a-z-]+=[a-z-]+)?)?(;base64)?,[a-z0-9!$&',()*+;=\\-._~:@/?%\\s]*\\s*$/i))&&t&&(a.crossOrigin=t),a.src=e})}e=e&&e.hasOwnProperty(\"default\")?e.default:e,t=t&&t.hasOwnProperty(\"default\")?t.default:t,o=o&&o.hasOwnProperty(\"default\")?o.default:o;var i=function(e,t){if(!(e instanceof t))throw new TypeError(\"Cannot call a class as a function\")},a=function(){function e(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,o,n){return o&&e(t.prototype,o),n&&e(t,n),t}}(),r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var o=arguments[t];for(var n in o)Object.prototype.hasOwnProperty.call(o,n)&&(e[n]=o[n])}return e},s=function(e,t){if(!e)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!t||\"object\"!=typeof t&&\"function\"!=typeof t?e:t},h=function(){return function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var o=[],n=!0,i=!1,a=void 0;try{for(var r,s=e[Symbol.iterator]();!(n=(r=s.next()).done)&&(o.push(r.value),!t||o.length!==t);n=!0);}catch(e){i=!0,a=e}finally{try{!n&&s.return&&s.return()}finally{if(i)throw a}}return o}(e,t);throw new TypeError(\"Invalid attempt to destructure non-iterable instance\")}}(),u=function(e){var t=!1;return{promise:new Promise(function(o,n){e.then(function(e){return t?n({isCanceled:!0}):o(e)},function(e){return n(t?{isCanceled:!0}:e)})}),cancel:function(){t=!0}}},c=!(\"undefined\"==typeof window||\"undefined\"==typeof navigator||!(\"ontouchstart\"in window||navigator.msMaxTouchPoints>0)),d=\"undefined\"!=typeof File,l={touch:{react:{down:\"onTouchStart\",mouseDown:\"onMouseDown\",drag:\"onTouchMove\",move:\"onTouchMove\",mouseMove:\"onMouseMove\",up:\"onTouchEnd\",mouseUp:\"onMouseUp\"},native:{down:\"touchstart\",mouseDown:\"mousedown\",drag:\"touchmove\",move:\"touchmove\",mouseMove:\"mousemove\",up:\"touchend\",mouseUp:\"mouseup\"}},desktop:{react:{down:\"onMouseDown\",drag:\"onDragOver\",move:\"onMouseMove\",up:\"onMouseUp\"},native:{down:\"mousedown\",drag:\"dragStart\",move:\"mousemove\",up:\"mouseup\"}}},p=c?l.touch:l.desktop,g=\"undefined\"!=typeof window&&window.devicePixelRatio?window.devicePixelRatio:1,m={x:.5,y:.5},v=function(e){function l(){var e,t,o;i(this,l);for(var n=arguments.length,a=Array(n),h=0;h<n;h++)a[h]=arguments[h];return t=o=s(this,(e=l.__proto__||Object.getPrototypeOf(l)).call.apply(e,[this].concat(a))),o.state={drag:!1,my:null,mx:null,image:m},o.handleImageReady=function(e){var t=o.getInitialSize(e.width,e.height);t.resource=e,t.x=.5,t.y=.5,o.setState({drag:!1,image:t},o.props.onImageReady),o.props.onLoadSuccess(t)},o.clearImage=function(){var e=o.canvas;e.getContext(\"2d\").clearRect(0,0,e.width,e.height),o.setState({image:m})},o.handleMouseDown=function(e){(e=e||window.event).preventDefault(),o.setState({drag:!0,mx:null,my:null})},o.handleMouseUp=function(){o.state.drag&&(o.setState({drag:!1}),o.props.onMouseUp())},o.handleMouseMove=function(e){if(e=e||window.event,!1!==o.state.drag){e.preventDefault();var t=e.targetTouches?e.targetTouches[0].pageX:e.clientX,n=e.targetTouches?e.targetTouches[0].pageY:e.clientY,i={mx:t,my:n},a=o.props.rotate;if(a=(a%=360)<0?a+360:a,o.state.mx&&o.state.my){var s=o.state.mx-t,h=o.state.my-n,u=o.state.image.width*o.props.scale,c=o.state.image.height*o.props.scale,d=o.getCroppingRect(),l=d.x,p=d.y;l*=u,p*=c;var g=function(e){return e*(Math.PI/180)},m=Math.cos(g(a)),v=Math.sin(g(a)),f=p+-s*v+h*m,y={x:(l+s*m+h*v)/u+1/o.props.scale*o.getXScale()/2,y:f/c+1/o.props.scale*o.getYScale()/2};o.props.onPositionChange(y),i.image=r({},o.state.image,y)}o.setState(i),o.props.onMouseMove(e)}},o.setCanvas=function(e){o.canvas=e},s(o,t)}return function(e,t){if(\"function\"!=typeof t&&null!==t)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(l,t.Component),a(l,[{key:\"componentDidMount\",value:function(){this.props.disableHiDPIScaling&&(g=1);var e=o.findDOMNode(this.canvas).getContext(\"2d\");if(this.props.image&&this.loadImage(this.props.image),this.paint(e),document){var t=!!function(){var e=!1;try{var t=Object.defineProperty({},\"passive\",{get:function(){e=!0}});window.addEventListener(\"test\",t,t),window.removeEventListener(\"test\",t,t)}catch(t){e=!1}return e}()&&{passive:!1},n=p.native;document.addEventListener(n.move,this.handleMouseMove,t),document.addEventListener(n.up,this.handleMouseUp,t),c&&(document.addEventListener(n.mouseMove,this.handleMouseMove,t),document.addEventListener(n.mouseUp,this.handleMouseUp,t))}}},{key:\"componentWillReceiveProps\",value:function(e){e.image&&this.props.image!==e.image||this.props.width!==e.width||this.props.height!==e.height?this.loadImage(e.image):e.image||this.clearImage()}},{key:\"componentDidUpdate\",value:function(e,t){var n=o.findDOMNode(this.canvas),i=n.getContext(\"2d\");i.clearRect(0,0,n.width,n.height),this.paint(i),this.paintImage(i,this.state.image,this.props.border),e.image===this.props.image&&e.width===this.props.width&&e.height===this.props.height&&e.position===this.props.position&&e.scale===this.props.scale&&e.rotate===this.props.rotate&&t.my===this.state.my&&t.mx===this.state.mx&&t.image.x===this.state.image.x&&t.image.y===this.state.image.y||this.props.onImageChange()}},{key:\"componentWillUnmount\",value:function(){if(document){var e=p.native;document.removeEventListener(e.move,this.handleMouseMove,!1),document.removeEventListener(e.up,this.handleMouseUp,!1),c&&(document.removeEventListener(e.mouseMove,this.handleMouseMove,!1),document.removeEventListener(e.mouseUp,this.handleMouseUp,!1))}}},{key:\"isVertical\",value:function(){return this.props.rotate%180!=0}},{key:\"getBorders\",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.props.border;return Array.isArray(e)?e:[e,e]}},{key:\"getDimensions\",value:function(){var e=this.props,t=e.width,o=e.height,n=e.rotate,i=e.border,a={},r=this.getBorders(i),s=h(r,2),u=s[0],c=s[1],d=t,l=o;return this.isVertical()?(a.width=l,a.height=d):(a.width=d,a.height=l),a.width+=2*u,a.height+=2*c,{canvas:a,rotate:n,width:t,height:o,border:i}}},{key:\"getImage\",value:function(){var e=this.getCroppingRect(),t=this.state.image;e.x*=t.resource.width,e.y*=t.resource.height,e.width*=t.resource.width,e.height*=t.resource.height;var o=document.createElement(\"canvas\");this.isVertical()?(o.width=e.height,o.height=e.width):(o.width=e.width,o.height=e.height);var n=o.getContext(\"2d\");return n.translate(o.width/2,o.height/2),n.rotate(this.props.rotate*Math.PI/180),n.translate(-o.width/2,-o.height/2),this.isVertical()&&n.translate((o.width-o.height)/2,(o.height-o.width)/2),n.drawImage(t.resource,-e.x,-e.y),o}},{key:\"getImageScaledToCanvas\",value:function(){var e=this.getDimensions(),t=e.width,o=e.height,n=document.createElement(\"canvas\");return this.isVertical()?(n.width=o,n.height=t):(n.width=t,n.height=o),this.paintImage(n.getContext(\"2d\"),this.state.image,0,1),n}},{key:\"getXScale\",value:function(){var e=this.props.width/this.props.height,t=this.state.image.width/this.state.image.height;return Math.min(1,e/t)}},{key:\"getYScale\",value:function(){var e=this.props.height/this.props.width,t=this.state.image.height/this.state.image.width;return Math.min(1,e/t)}},{key:\"getCroppingRect\",value:function(){var e=this.props.position||{x:this.state.image.x,y:this.state.image.y},t=1/this.props.scale*this.getXScale(),o=1/this.props.scale*this.getYScale(),n={x:e.x-t/2,y:e.y-o/2,width:t,height:o},i=0,a=1-n.width,s=0,h=1-n.height;return(this.props.disableBoundaryChecks||t>1||o>1)&&(i=-n.width,a=1,s=-n.height,h=1),r({},n,{x:Math.max(i,Math.min(n.x,a)),y:Math.max(s,Math.min(n.y,h))})}},{key:\"loadImage\",value:function(e){var t;d&&e instanceof File?this.loadingImage=u((t=e,new Promise(function(e,o){var i=new FileReader;i.onload=function(t){try{var i=n(t.target.result);e(i)}catch(t){o(t)}},i.readAsDataURL(t)}))).promise.then(this.handleImageReady).catch(this.props.onLoadFailure):\"string\"==typeof e&&(this.loadingImage=u(n(e,this.props.crossOrigin)).promise.then(this.handleImageReady).catch(this.props.onLoadFailure))}},{key:\"getInitialSize\",value:function(e,t){var o=void 0,n=void 0,i=this.getDimensions();return i.height/i.width>t/e?n=e*((o=this.getDimensions().height)/t):o=t*((n=this.getDimensions().width)/e),{height:o,width:n}}},{key:\"paintImage\",value:function(e,t,o){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:g;if(t.resource){var i=this.calculatePosition(t,o);e.save(),e.translate(e.canvas.width/2,e.canvas.height/2),e.rotate(this.props.rotate*Math.PI/180),e.translate(-e.canvas.width/2,-e.canvas.height/2),this.isVertical()&&e.translate((e.canvas.width-e.canvas.height)/2,(e.canvas.height-e.canvas.width)/2),e.scale(n,n),e.globalCompositeOperation=\"destination-over\",e.drawImage(t.resource,i.x,i.y,i.width,i.height),e.restore()}}},{key:\"calculatePosition\",value:function(e,t){e=e||this.state.image;var o=this.getBorders(t),n=h(o,2),i=n[0],a=n[1],r=this.getCroppingRect(),s=e.width*this.props.scale,u=e.height*this.props.scale,c=-r.x*s,d=-r.y*u;return this.isVertical()?(c+=a,d+=i):(c+=i,d+=a),{x:c,y:d,height:u,width:s}}},{key:\"paint\",value:function(e){e.save(),e.scale(g,g),e.translate(0,0),e.fillStyle=\"rgba(\"+this.props.color.slice(0,4).join(\",\")+\")\";var t=this.props.borderRadius,o=this.getDimensions(),n=this.getBorders(o.border),i=h(n,2),a=i[0],r=i[1],s=o.canvas.height,u=o.canvas.width;t=Math.max(t,0),t=Math.min(t,u/2-a,s/2-r),e.beginPath(),function(e,t,o,n,i,a){if(0===a)e.rect(t,o,n,i);else{var r=n-a,s=i-a;e.translate(t,o),e.arc(a,a,a,Math.PI,1.5*Math.PI),e.lineTo(r,0),e.arc(r,a,a,1.5*Math.PI,2*Math.PI),e.lineTo(n,s),e.arc(r,s,a,2*Math.PI,.5*Math.PI),e.lineTo(a,i),e.arc(a,s,a,.5*Math.PI,Math.PI),e.translate(-t,-o)}}(e,a,r,u-2*a,s-2*r,t),e.rect(u,0,-u,s),e.fill(\"evenodd\"),e.restore()}},{key:\"render\",value:function(){var e=this.props,o=(e.scale,e.rotate,e.image,e.border,e.borderRadius,e.width,e.height,e.position,e.color,e.style),n=(e.crossOrigin,e.onLoadFailure,e.onLoadSuccess,e.onImageReady,e.onImageChange,e.onMouseUp,e.onMouseMove,e.onPositionChange,e.disableBoundaryChecks,e.disableHiDPIScaling,function(e,t){var o={};for(var n in e)t.indexOf(n)>=0||Object.prototype.hasOwnProperty.call(e,n)&&(o[n]=e[n]);return o}(e,[\"scale\",\"rotate\",\"image\",\"border\",\"borderRadius\",\"width\",\"height\",\"position\",\"color\",\"style\",\"crossOrigin\",\"onLoadFailure\",\"onLoadSuccess\",\"onImageReady\",\"onImageChange\",\"onMouseUp\",\"onMouseMove\",\"onPositionChange\",\"disableBoundaryChecks\",\"disableHiDPIScaling\"])),i=this.getDimensions(),a={width:i.canvas.width,height:i.canvas.height,cursor:this.state.drag?\"grabbing\":\"grab\",touchAction:\"none\"},s={width:i.canvas.width*g,height:i.canvas.height*g,style:r({},a,o)};return s[p.react.down]=this.handleMouseDown,c&&(s[p.react.mouseDown]=this.handleMouseDown),t.createElement(\"canvas\",r({ref:this.setCanvas},s,n))}}]),l}();return v.propTypes={scale:e.number,rotate:e.number,image:e.oneOfType([e.string].concat(function(e){if(Array.isArray(e)){for(var t=0,o=Array(e.length);t<e.length;t++)o[t]=e[t];return o}return Array.from(e)}(d?[e.instanceOf(File)]:[]))),border:e.oneOfType([e.number,e.arrayOf(e.number)]),borderRadius:e.number,width:e.number,height:e.number,position:e.shape({x:e.number,y:e.number}),color:e.arrayOf(e.number),crossOrigin:e.oneOf([\"\",\"anonymous\",\"use-credentials\"]),onLoadFailure:e.func,onLoadSuccess:e.func,onImageReady:e.func,onImageChange:e.func,onMouseUp:e.func,onMouseMove:e.func,onPositionChange:e.func,disableBoundaryChecks:e.bool,disableHiDPIScaling:e.bool},v.defaultProps={scale:1,rotate:0,border:25,borderRadius:0,width:200,height:200,color:[0,0,0,.5],onLoadFailure:function(){},onLoadSuccess:function(){},onImageReady:function(){},onImageChange:function(){},onMouseUp:function(){},onMouseMove:function(){},onPositionChange:function(){},disableBoundaryChecks:!1,disableHiDPIScaling:!1},v});\n\n\n//# sourceURL=webpack:///./node_modules/react-avatar-editor/dist/index.js?");

/***/ })

}]);