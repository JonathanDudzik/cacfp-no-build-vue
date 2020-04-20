'use strict';

Vue.component("side-menu", {
    props: ['passedView', 'passedTemplate', 'passedState'],
    data: function() {
        return {
            currentSectionSelector: null
        }
    },
    computed: {

        currentModuleIndex: function() {
            var modulefilter = this.passedView.moduleReference
            return this.passedTemplate[0].modulesArray.findIndex(k => k.moduleId == modulefilter)
        },

        nextModuleId: function() {
            var nextModuleIndex = this.currentModuleIndex + 1
            return this.passedTemplate[0].modulesArray[nextModuleIndex].moduleId
        },

        currentSectionIndex: function() {
            var sectionfilter = this.passedView.sectionReference
            return this.passedTemplate[0].modulesArray[this.currentModuleIndex].sectionsArray.findIndex(k => k.sectionId == sectionfilter)
        },

        nextSectionId: function() {
            var nextSectionIndex = this.currentSectionIndex + 1
            return this.passedTemplate[0].modulesArray[this.currentModuleIndex].sectionsArray[nextSectionIndex].sectionId
        }
    },

    methods: {
        sideMenuHandler: function(type, template, ) {
            
            if(type == "course") {
                this.$emit('emit-view', 'course', template.courseId)
                this.$emit('emit-view', 'module', template.modulesArray[0].moduleId)
                this.$emit('emit-view', 'section', template.modulesArray[0].sectionsArray[0].sectionId)
            }
            
            if(type == "module") {
                this.$emit('emit-view', 'module', template.moduleId)
                this.$emit('emit-view', 'section', template.sectionsArray[0].sectionId)
            }
            
            if(type == "section") {
                this.$emit('emit-view', 'section', template.sectionId)
            }
            
            this.$emit('emit-media-manager')
            
            gsap.to(window, 1, {scrollTo:{y:"#side-menu", offsetY:15}})
            
            // for when the side menu is clicked it will not work from this scope until the dom has been updated! 
            if(document.getElementById(this.passedView.sectionReference + 'Selector')) {
                this.computedClass()
            }
        },

        computedClass: function() {
            // create an array from this object? and then filter it?
            if(this.currentSectionSelector) {
                gsap.to(this.currentSectionSelector, {backgroundColor: 'transparent'})
            }
            var ref = document.getElementById(this.passedView.sectionReference + 'Selector')
            this.currentSectionSelector = ref
            gsap.to(this.currentSectionSelector, {backgroundColor: 'red'})
        },

        sliderHandler: function(type) {
            this.$emit('emit-slider', type)

            // GSAP Timeline
            TweenLite.defaultEase = Linear.easeNone
            var fill = '#' + [type] + '-slider-fill'
            var label = '#' + [type] + '-slider-label'
            var knob = '#' + [type] + '-slider-knob'

            var timeline = new TimelineMax({})
            
            if(this.passedState[type + 'Playing'] == true) { 
                timeline.to(fill, 0.2, {backgroundColor: '#337AB7'}, 0.2)
                timeline.set(label, {text: "on", x: '-25px'}, 0.2)
                timeline.to(knob, 0.2, {x: '48px'}, 0.2)
            }

            if(this.passedState[type + 'Playing'] == false) {
                timeline.to(fill, 0.2, {backgroundColor: '#092940'}, 0.2)
                timeline.set(label, {text: "off", x: '0px'}, 0.2)
                timeline.to(knob, 0.2, {x: '0px'}, 0.2)
            }
        }
    },
    updated: function() {
        return this.computedClass()
    }
});

/***************************************************
 * Main Vue Instance (must be below all other code)
 ***************************************************/
var vueRoot = new Vue({
    el: "#vue-app",
    data: {
        state: {
            currentAudioObject: null,
            audioPlaying: false
        },
        view: {
            courseReference: "adult-eligibility-application", // resolves to courseId
            moduleReference: null, // resolves to moduleId
            sectionReference: null // resolves to sectionId
        },
        template: [
            {
                courseName: "Adult Eligibility Application",
                courseId: "adult-eligibility-application",
                courseIndex: 100,
                modulesArray: [
                    {
                        moduleName: "Welcome",
                        moduleId: "welcome",
                        moduleIndex: 110,
                        moduleParentId: 'adult-eligibility-application',
                        sectionsArray: [
                            {
                                sectionName: "Objectives",
                                sectionId: "objectives",
                                sectionIndex: 111,
                                sectionParentId: 'welcome',
                                sectionAudio: null
                            },
                            {
                                sectionName: "Regulations",
                                sectionId: "regulations",
                                sectionIndex: 112,
                                sectionParentId: 'welcome',
                                sectionAudio: null
                            }
                        ]
                    },
                    {
                        moduleName: "Eligibility Application",
                        moduleId: "eligibility-application",
                        moduleIndex: 120,
                        moduleParentId: 'adult-eligibility-application',
                        sectionsArray: [
                            {
                                sectionName: "First Page",
                                sectionId: "first-page",
                                sectionIndex: 121,
                                sectionParentId: 'eligibility-application',
                                sectionAudio: null
                            },
                            {
                                sectionName: "Second Page",
                                sectionId: "second-page",
                                sectionIndex: 122,
                                sectionParentId: 'eligibility-application',
                                sectionAudio: './media/eligibility-adult-sc2.mp3'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    methods: {
        setView: function(type, id) {
            this.view[type + 'Reference'] = id
        },

        setMediaOptions: function(type) {
            this.state[type + 'Playing'] = !this.state[type + 'Playing']
        },

        manageMedia: function() {
            // manage pausing media
            if(this.state.currentAudioObject) {
                this.state.currentAudioObject.pause()
                this.state.currentAudioObject = null
            }
            
            // manage playing media
            if(this.state.audioPlaying == true) {
                if(document.getElementById('audio')) {
                    var audio = document.getElementById('audio');
                    this.state.currentAudioObject = audio;
                    this.state.currentAudioObject.play();
                }
            }
            return
        },

        initAnim: function() {
            // initial animation timeline on this component's mounted hook
            TweenLite.defaultEase = Linear.easeNone
            var timeline = new TimelineMax({repeat:-1, yoyo:true})
            timeline.fromTo('#hero-cta', 0.8, {rotate: -2, scale: 0.9}, {rotate: 2, scale: 1.1})
        },

        scrollTo: function() {
            gsap.to(window, {duration: 1, scrollTo: "#side-menu"})
        },

        firstEnter: function(el, done) {
            done()
        },
        
        firstLeave: function(el, done) {
            done()
        }
    },
    mounted: function() {
        return this.initAnim()
    },
    updated: function() { 
        return this.manageMedia()
    },
    watch: {
        // this watcher is for the slider event
        'state.audioPlaying': {
            handler: function() {
                this.manageMedia()
            }
        }
    }
});