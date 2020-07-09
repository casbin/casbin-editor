(this["webpackJsonpcasbin-editor"]=this["webpackJsonpcasbin-editor"]||[]).push([[0],{1:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"f",(function(){return p})),n.d(t,"d",(function(){return d})),n.d(t,"c",(function(){return b})),n.d(t,"b",(function(){return m})),n.d(t,"e",(function(){return f}));var a=n(7),r=n(8);function o(){var e=Object(a.a)(["\n  padding: 1em;\n  background: #222;\n"]);return o=function(){return e},e}function i(){var e=Object(a.a)(["\n  color: ",";\n  font-weight: 600;\n  font-size: 14px;\n"]);return i=function(){return e},e}function c(){var e=Object(a.a)(["\n  flex: 1;\n"]);return c=function(){return e},e}function _(){var e=Object(a.a)(["\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n"]);return _=function(){return e},e}function s(){var e=Object(a.a)(["\n  padding: 8px;\n"]);return s=function(){return e},e}function l(){var e=Object(a.a)(["\n  border: 1px solid #443d80;\n  border-radius: 3px;\n  color: #443d80;\n  display: inline-block;\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 1.2em;\n  padding: 10px;\n  text-decoration: none !important;\n  text-transform: uppercase;\n  transition: background 0.3s, color 0.3s;\n\n  :hover {\n    background: #443d80;\n    color: #fff;\n  }\n"]);return l=function(){return e},e}var u=r.a.button(l()),p=r.a.h4(s()),d=r.a.div(_()),b=r.a.div(c()),m=r.a.span(i(),(function(e){switch(e.type){case"error":return"#db4545";case"pass":return"#39aa56"}}));m.defaultProps={type:"pass"};var f=r.a.div(o())},38:function(module,__webpack_exports__,__webpack_require__){"use strict";var J_github_repos_casbin_editor_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(4),J_github_repos_casbin_editor_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(J_github_repos_casbin_editor_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__),J_github_repos_casbin_editor_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(40),J_github_repos_casbin_editor_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(39),react__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(0),react__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__),_ui__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(1),casbin__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(18),casbin__WEBPACK_IMPORTED_MODULE_5___default=__webpack_require__.n(casbin__WEBPACK_IMPORTED_MODULE_5__),RunTest=function RunTest(props){return react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(_ui__WEBPACK_IMPORTED_MODULE_4__.a,{style:{marginRight:8},onClick:Object(J_github_repos_casbin_editor_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__.a)(J_github_repos_casbin_editor_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark((function _callee(){var startTime,result,e,fnString,fns,_iteratorNormalCompletion,_didIteratorError,_iteratorError,_iterator,_step,n,p,stopTime;return J_github_repos_casbin_editor_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap((function _callee$(_context){for(;;)switch(_context.prev=_context.next){case 0:return startTime=performance.now(),result=[],_context.prev=2,_context.next=5,Object(casbin__WEBPACK_IMPORTED_MODULE_5__.newEnforcer)(Object(casbin__WEBPACK_IMPORTED_MODULE_5__.newModel)(props.model),new casbin__WEBPACK_IMPORTED_MODULE_5__.StringAdapter(props.policy));case 5:if(e=_context.sent,fnString=props.fn,!fnString){_context.next=18;break}_context.prev=8,fns={},eval("".concat(fnString)),fns&&Object.keys(fns).forEach((function(t){return e.addFunction(t,fns[t])})),_context.next=18;break;case 14:return _context.prev=14,_context.t0=_context.catch(8),props.onResponse(react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(_ui__WEBPACK_IMPORTED_MODULE_4__.b,null,"Please check syntax in Custom Function Editor.")),_context.abrupt("return");case 18:_iteratorNormalCompletion=!0,_didIteratorError=!1,_iteratorError=void 0,_context.prev=21,_iterator=props.request.split("\n")[Symbol.iterator]();case 23:if(_iteratorNormalCompletion=(_step=_iterator.next()).done){_context.next=36;break}if(n=_step.value,p=n.split(",").map((function(e){return e.trim()})).filter((function(e){return e})),p&&0!==p.length){_context.next=28;break}return _context.abrupt("return");case 28:return _context.t1=result,_context.next=31,e.enforce.apply(e,Object(J_github_repos_casbin_editor_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_1__.a)(p));case 31:_context.t2=_context.sent,_context.t1.push.call(_context.t1,_context.t2);case 33:_iteratorNormalCompletion=!0,_context.next=23;break;case 36:_context.next=42;break;case 38:_context.prev=38,_context.t3=_context.catch(21),_didIteratorError=!0,_iteratorError=_context.t3;case 42:_context.prev=42,_context.prev=43,_iteratorNormalCompletion||null==_iterator.return||_iterator.return();case 45:if(_context.prev=45,!_didIteratorError){_context.next=48;break}throw _iteratorError;case 48:return _context.finish(45);case 49:return _context.finish(42);case 50:stopTime=performance.now(),props.onResponse(react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(_ui__WEBPACK_IMPORTED_MODULE_4__.b,null,"Done in "+((stopTime-startTime)/1e3).toFixed(2)+"s")),props.onResponse(result),_context.next=59;break;case 55:_context.prev=55,_context.t4=_context.catch(2),props.onResponse(react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(_ui__WEBPACK_IMPORTED_MODULE_4__.b,{type:"error"},_context.t4.message)),props.onResponse([]);case 59:case"end":return _context.stop()}}),_callee,null,[[2,55],[8,14],[21,38,42,50],[43,,45,49]])})))},"RUN THE TEST")};__webpack_exports__.a=RunTest},43:function(e,t,n){e.exports=n(95)},95:function(e,t,n){"use strict";n.r(t);var a,r=n(0),o=n.n(r),i=n(35),c=n.n(i),_=n(5),s={basic:"[request_definition]\nr = sub, obj, act\n\n[policy_definition]\np = sub, obj, act\n\n[policy_effect]\ne = some(where (p.eft == allow))\n\n[matchers]\nm = r.sub == p.sub && r.obj == p.obj && r.act == p.act",basic_with_root:'[request_definition]\nr = sub, obj, act\n\n[policy_definition]\np = sub, obj, act\n\n[policy_effect]\ne = some(where (p.eft == allow))\n\n[matchers]\nm = r.sub == p.sub && r.obj == p.obj && r.act == p.act || r.sub == "root"',basic_without_resources:"[request_definition]\nr = sub, act\n\n[policy_definition]\np = sub, act\n\n[policy_effect]\ne = some(where (p.eft == allow))\n\n[matchers]\nm = r.sub == p.sub && r.act == p.act",basic_without_users:"[request_definition]\nr = obj, act\n\n[policy_definition]\np = obj, act\n\n[policy_effect]\ne = some(where (p.eft == allow))\n\n[matchers]\nm = r.obj == p.obj && r.act == p.act",rbac:"[request_definition]\nr = sub, obj, act\n\n[policy_definition]\np = sub, obj, act\n\n[role_definition]\ng = _, _\n\n[policy_effect]\ne = some(where (p.eft == allow))\n\n[matchers]\nm = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act",rbac_with_resource_roles:"[request_definition]\nr = sub, obj, act\n\n[policy_definition]\np = sub, obj, act\n\n[role_definition]\ng = _, _\ng2 = _, _\n\n[policy_effect]\ne = some(where (p.eft == allow))\n\n[matchers]\nm = g(r.sub, p.sub) && g2(r.obj, p.obj) && r.act == p.act",rbac_with_domains:"[request_definition]\nr = sub, dom, obj, act\n\n[policy_definition]\np = sub, dom, obj, act\n\n[role_definition]\ng = _, _, _\n\n[policy_effect]\ne = some(where (p.eft == allow))\n\n[matchers]\nm = g(r.sub, p.sub, r.dom) && r.dom == p.dom && r.obj == p.obj && r.act == p.act",rbac_with_deny:"[request_definition]\nr = sub, obj, act\n\n[policy_definition]\np = sub, obj, act, eft\n\n[role_definition]\ng = _, _\n\n[policy_effect]\ne = some(where (p.eft == allow)) && !some(where (p.eft == deny))\n\n[matchers]\nm = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act",abac:"[request_definition]\nr = sub, obj, act\n\n[policy_definition]\np = sub, obj, act\n\n[policy_effect]\ne = some(where (p.eft == allow))\n\n[matchers]\nm = r.sub == r.obj.Owner",keymatch:"[request_definition]\nr = sub, obj, act\n\n[policy_definition]\np = sub, obj, act\n\n[policy_effect]\ne = some(where (p.eft == allow))\n\n[matchers]\nm = r.sub == p.sub && keyMatch(r.obj, p.obj) && regexMatch(r.act, p.act)",keymatch2:"[request_definition]\nr = sub, obj, act\n\n[policy_definition]\np = sub, obj, act\n\n[policy_effect]\ne = some(where (p.eft == allow))\n\n[matchers]\nm = r.sub == p.sub && keyMatch2(r.obj, p.obj) && regexMatch(r.act, p.act)",ipmatch:"[request_definition]\nr = sub, obj, act\n\n[policy_definition]\np = sub, obj, act\n\n[policy_effect]\ne = some(where (p.eft == allow))\n\n[matchers]\nm = ipMatch(r.sub, p.sub) && r.obj == p.obj && r.act == p.act",priority:"[request_definition]\nr = sub, obj, act\n\n[policy_definition]\np = sub, obj, act, eft\n\n[role_definition]\ng = _, _\n\n[policy_effect]\ne = priority(p.eft) || deny\n\n[matchers]\nm = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act"},l={basic:"p, alice, data1, read\np, bob, data2, write",basic_with_root:"p, alice, data1, read\np, bob, data2, write",basic_without_resources:"p, alice, read\np, bob, write",basic_without_users:"p, data1, read\np, data2, write",rbac:"p, alice, data1, read\np, bob, data2, write\np, data2_admin, data2, read\np, data2_admin, data2, write\n\ng, alice, data2_admin",rbac_with_resource_roles:"p, alice, data1, read\np, bob, data2, write\np, data_group_admin, data_group, write\n\ng, alice, data_group_admin\ng2, data1, data_group\ng2, data2, data_group",rbac_with_domains:"p, admin, domain1, data1, read\np, admin, domain1, data1, write\np, admin, domain2, data2, read\np, admin, domain2, data2, write\n\ng, alice, admin, domain1\ng, bob, admin, domain2",rbac_with_deny:"p, alice, data1, read, allow\np, bob, data2, write, allow\np, data2_admin, data2, read, allow\np, data2_admin, data2, write, allow\np, alice, data2, write, deny\n\ng, alice, data2_admin",abac:"",keymatch:"p, alice, /alice_data/*, GET\np, alice, /alice_data/resource1, POST\n\np, bob, /alice_data/resource2, GET\np, bob, /bob_data/*, POST\n\np, cathy, /cathy_data, (GET)|(POST)",keymatch2:"p, alice, /alice_data/:resource, GET\np, alice, /alice_data2/:id/using/:resId, GET",ipmatch:"p, 192.168.2.0/24, data1, read\np, 10.0.0.0/16, data2, write",priority:"p, alice, data1, read, allow\np, data1_deny_group, data1, read, deny\np, data1_deny_group, data1, write, deny\np, alice, data1, write, allow\n\ng, alice, data1_deny_group\n\np, data2_allow_group, data2, read, allow\np, bob, data2, read, deny\np, bob, data2, write, deny\n\ng, bob, data2_allow_group"},u={basic:"alice, data1, read",basic_with_root:"alice, data1, read",basic_without_resources:"alice, read",basic_without_users:"data1, read",rbac:"alice, data2, read",rbac_with_resource_roles:"alice, data1, read\nalice, data1, write\nalice, data2, read\nalice, data2, write ",rbac_with_domains:"alice, domain1, data1, read",rbac_with_deny:"alice, data1, read\nalice, data2, write",abac:"Not support",keymatch:"alice, /alice_data/hello, GET",keymatch2:"alice, /alice_data/hello, GET\nalice, /alice_data/hello, POST",ipmatch:"Not support",priority:"alice, data1, read"},p="basic";function d(e,t){return"".concat(t.toUpperCase(),"_").concat(a[e])}function b(){var e=window.localStorage.getItem(a.MODEL.toString());return e||p}function m(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:p,n=window.localStorage.getItem(d(e,t));if(n)return n;switch(e){case a.MODEL:return s[t];case a.POLICY:return l[t];case a.REQUEST:return u[t];case a.CUSTOM_FUNCTION:return"var fns = {}"}}!function(e){e[e.MODEL=0]="MODEL",e[e.POLICY=1]="POLICY",e[e.REQUEST=2]="REQUEST",e[e.CUSTOM_FUNCTION=3]="CUSTOM_FUNCTION"}(a||(a={}));var f=function(e){return o.a.createElement("select",{defaultValue:b(),onChange:function(t){var n,r=t.target.value;n=r,window.localStorage.setItem(a[a.MODEL],n),e.onChange(r)}},o.a.createElement("option",{value:"",disabled:!0},"Select your model"),o.a.createElement("option",{value:"basic"},"ACL"),o.a.createElement("option",{value:"basic_with_root"},"ACL with superuser"),o.a.createElement("option",{value:"basic_without_resources"},"ACL without resources"),o.a.createElement("option",{value:"basic_without_users"},"ACL without users"),o.a.createElement("option",{value:"rbac"},"RBAC"),o.a.createElement("option",{value:"rbac_with_resource_roles"},"RBAC with resource roles"),o.a.createElement("option",{value:"rbac_with_domains"},"RBAC with domains/tenants"),o.a.createElement("option",{value:"rbac_with_deny"},"RBAC with deny-override"),o.a.createElement("option",{value:"abac"},"ABAC"),o.a.createElement("option",{value:"keymatch"},"RESTful (KeyMatch)"),o.a.createElement("option",{value:"keymatch2"},"RESTful (KeyMatch2)"),o.a.createElement("option",{value:"ipmatch"},"IP match"),o.a.createElement("option",{value:"priority"},"Priority"))};f.defaultProps={onChange:console.log,defaultValue:"basic"};var E=f,h=n(1),w=n(25),g=(n(53),n(54),n(55),n(56),n(57),n(58),n(6)),O=n.n(g);O.a.defineMode("casbin-conf",(function(){function e(e,t){var n=e.peek();if("["===n)return e.match("[request_definition")?(t.sec="r",e.skipTo("]"),e.eat("]"),"header"):e.match("[policy_definition")?(t.sec="p",e.skipTo("]"),e.eat("]"),"header"):e.match("[role_definition")?(t.sec="g",e.skipTo("]"),e.eat("]"),"header"):e.match("[policy_effect")?(t.sec="e",e.skipTo("]"),e.eat("]"),"header"):e.match("[matchers")?(t.sec="m",e.skipTo("]"),e.eat("]"),"header"):(t.sec="",e.skipToEnd(),"");if("#"===n)return e.skipToEnd(),"comment";if('"'===n)return e.skipToEnd(),e.skipTo('"'),e.eat('"'),"string";if("="===n&&(t.after_equal=!0,e.eat("=")),e.sol()&&(t.after_equal=!1),""===t.sec)return e.skipToEnd(),"";if(e.sol())return""!==t.sec?("g"===t.sec&&e.match(new RegExp("^g[2-9]?"))||e.match(t.sec))&&(" "===e.peek()||"="===e.peek())?"builtin":(t.sec="",void e.next()):void e.next();if(t.after_equal){if("r"===t.sec||"p"===t.sec){if(t.comma&&(t.comma=!1,e.match(new RegExp("^[_a-zA-Z][_a-zA-Z0-9]*"))))return"property";if(e.eat(",")||e.eat(" "))return t.comma=!0,""}else if("e"===t.sec){if(t.dot&&(t.dot=!1,e.match(new RegExp("^[_a-zA-Z][_a-zA-Z0-9]*"))))return"property";if(e.eat("."))return t.dot=!0,"";if(e.match("p")&&"."===e.peek())return"builtin";if(e.match("some")||e.match("where")||e.match("priority"))return"keyword";if(e.match("allow")||e.match("deny"))return"string"}else if("m"===t.sec){if(t.dot&&(t.dot=!1,e.match(new RegExp("^[_a-zA-Z][_a-zA-Z0-9]*"))))return"property";if(e.eat("."))return t.dot=!0,"";if((e.match("r")||e.match("p"))&&"."===e.peek())return"builtin";if(e.match(new RegExp("^[_a-zA-Z][_a-zA-Z0-9]*"))&&"("===e.peek())return"def"}e.next()}else e.next()}return{startState:function(){return{tokenize:e}},token:function(e,t){return t.tokenize(e,t)}}})),O.a.defineMode("casbin-csv",(function(){function e(e,t){var n=e.peek();return"#"===n?(e.skipToEnd(),"comment"):","===n?(e.eat(","),""):e.sol()&&e.match("p")?"def":e.sol()&&(e.match("g2")||e.match("g"))?"keyword":e.skipTo(",")?"string":(e.skipToEnd(),"property")}return{startState:function(){return{tokenize:e}},token:function(e,t){return t.tokenize(e,t)}}}));var y=function(e){var t=Object(r.useState)(m(e.persist,e.model)),n=Object(_.a)(t,2),a=n[0],i=n[1],c=e.model,s=e.onChange,l=e.persist;return Object(r.useEffect)((function(){var e=m(l,c);i(e),s(e)}),[c,l,s]),o.a.createElement("div",{style:e.style},o.a.createElement(w.Controlled,{onBeforeChange:function(t,n,a){i(a),e.onChange(a),function(e,t){var n=b()||p;window.localStorage.setItem(d(e,n),t)}(e.persist,a)},options:e.options,value:a}))};y.defaultProps={onChange:function(){}};var j=function(e){return o.a.createElement(y,Object.assign({persist:a.CUSTOM_FUNCTION,options:{lineNumbers:!0,indentUnit:4,styleActiveLine:!0,matchBrackets:!0,mode:"javascript",lineWrapping:!0,theme:"monokai"}},e))},k=function(e){return o.a.createElement(y,Object.assign({persist:a.MODEL,options:{lineNumbers:!0,indentUnit:4,styleActiveLine:!0,matchBrackets:!0,mode:"casbin-conf",lineWrapping:!0,theme:"monokai"}},e))},v=function(e){return o.a.createElement(y,Object.assign({persist:a.POLICY,options:{lineNumbers:!0,indentUnit:4,styleActiveLine:!0,matchBrackets:!0,mode:"casbin-csv",lineWrapping:!0,theme:"monokai"}},e))},T=function(e){return o.a.createElement(y,Object.assign({persist:a.REQUEST,options:{lineNumbers:!0,indentUnit:4,styleActiveLine:!0,matchBrackets:!0,mode:"casbin-csv",lineWrapping:!0,theme:"monokai"}},e))},x=function(e){return o.a.createElement("div",{style:e.style},o.a.createElement(w.Controlled,{onBeforeChange:function(){},value:e.value,options:{readOnly:!0,indentUnit:4,styleActiveLine:!0,matchBrackets:!0,mode:"javascript",lineWrapping:!0,theme:"monokai"}}))},C=n(17),M=function(e){return o.a.createElement(h.a,{style:{marginRight:8},onClick:function(){try{C.Config.newConfigFromText(e.model),e.onResponse(o.a.createElement(h.b,null,"passed"))}catch(t){e.onResponse(o.a.createElement(h.b,{type:"error"},t.message))}}},"SYNTAX VALIDATE")},P=n(38),D=function(){var e=Object(r.useState)(b()),t=Object(_.a)(e,2),n=t[0],i=t[1],c=Object(r.useState)(""),s=Object(_.a)(c,2),l=s[0],u=s[1],p=Object(r.useState)(""),m=Object(_.a)(p,2),f=m[0],w=m[1],g=Object(r.useState)(""),O=Object(_.a)(g,2),y=O[0],C=O[1],D=Object(r.useState)(""),R=Object(_.a)(D,2),A=R[0],I=R[1],L=Object(r.useState)(o.a.createElement(o.a.Fragment,null)),U=Object(_.a)(L,2),S=U[0],B=U[1],W=Object(r.useState)(""),q=Object(_.a)(W,2),K=q[0],N=q[1],F=Object(r.useState)(!1),z=Object(_.a)(F,2),G=z[0],J=z[1];return o.a.createElement(o.a.Fragment,null,o.a.createElement(h.d,null,o.a.createElement(h.c,null,o.a.createElement(h.d,null,o.a.createElement(h.f,null,"Model"),o.a.createElement(E,{onChange:function(e){i(e)}}),o.a.createElement(h.a,{onClick:function(){window.confirm("Confirm Reset?")&&(!function(e){for(var t in a)if(a.hasOwnProperty(t)){var n=parseInt(t,10);isNaN(n)&&window.localStorage.removeItem(d(n,e))}}(n),window.location.reload())},style:{marginLeft:8}},"Reset")),o.a.createElement(k,{model:n,onChange:u})),o.a.createElement(h.c,null,o.a.createElement(h.f,null,"Policy"),o.a.createElement(v,{model:n,onChange:w}))),o.a.createElement(h.d,null,o.a.createElement(h.c,null,o.a.createElement(h.f,null,"Request"),o.a.createElement(T,{model:n,onChange:I})),o.a.createElement(h.c,null,o.a.createElement(h.f,null,"Enforcement Result"),o.a.createElement(x,{value:K}))),o.a.createElement(h.d,null,o.a.createElement(h.c,null,o.a.createElement(h.d,null,o.a.createElement(h.f,null,"Custom Function"),o.a.createElement(h.a,{onClick:function(){return J(!G)}},"TOGGLE")),G&&o.a.createElement(j,{model:n,onChange:C}))),o.a.createElement("div",{style:{padding:8}},o.a.createElement(M,{model:l,onResponse:function(e){return B(e)}}),o.a.createElement(P.a,{model:l,policy:f,fn:y,request:A,onResponse:function(e){Object(r.isValidElement)(e)?B(e):Array.isArray(e)&&N(e.join("\n"))}}),o.a.createElement("div",{style:{display:"inline-block"}},S)))},R=(n(94),document.getElementById("root"));c.a.render(o.a.createElement((function(){return o.a.createElement(o.a.Fragment,null,o.a.createElement(D,null),o.a.createElement(h.e,null,o.a.createElement("a",{target:"_blank",href:"https://github.com/casbin/casbin-editor"},o.a.createElement("img",{alt:"GitHub stars",src:"https://img.shields.io/github/stars/casbin/casbin-editor?style=social"})),o.a.createElement("span",{style:{color:"#FFFFFF",float:"right",fontSize:14}},"Copyright \xa9 ",(new Date).getFullYear()," Casbin contributors.")))}),null),R)}},[[43,1,2]]]);
//# sourceMappingURL=main.30191de1.chunk.js.map