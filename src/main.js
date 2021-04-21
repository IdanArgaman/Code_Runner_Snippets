import Vue from 'vue'
import App from './App.vue'
import VueHighlightJS from 'vue-highlightjs'

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/atom-one-dark.css';

import CodeRunner from './components/CodeRunner.vue';

import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
	routes: [{
		name: "code",
		path: '/code/:codeBase',
		props: true,
		component: CodeRunner,

	}]
});

Vue.use(VueHighlightJS, {
	languages: {
		javascript
	}
});

Vue.config.productionTip = false

new Vue({
	render: h => h(App),
	router
}).$mount('#app')