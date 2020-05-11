'use strict';

Vue.component("main-content", {
    props: ['audioSrc', 'passedState', 'col1Classes', 'col2Classes'],
    data: function() {
        return {
            currentAudioObject: null,
        }
    },
    methods: {
        manageMedia: function() {
            console.log('managing Media!')
            // manage pausing media
            if(this.currentAudioObject) {
                this.currentAudioObject.pause()
                this.currentAudioObject = null
            }
            
            // manage playing media
            if(this.passedState.audioPlaying == true) {
                if(document.getElementById('audio')) {
                    var audio = document.getElementById('audio');
                    console.log(audio)
                    this.currentAudioObject = audio;
                    this.currentAudioObject.play();
                }
            }
            return
        },
    
        firstEnter: function(el, done) {
            console.log("enter")
            gsap.fromTo(el, 0.3, {scale: 0, opacity: 0}, {scale: 1, opacity: 1, onComplete: function(){done()}})
        }
    },
    updated: function() { 
        return this.manageMedia()
    },
    watch: {
        // this watcher is for the slider event
        'passedState.audioPlaying': {
            handler: function() {
                this.manageMedia()
            }
        }
    },
    render: function(createElement) {  
        return createElement(
            'div', 
            {
                class: ['column', 'is-10']
            },
            [
                createElement(
                    'transition',
                    {
                        props: {
                            appear: true,
                            css: false,
                            mode: "in-out",
                        },
                        on: {
                            enter: this.firstEnter 
                        }
                    },
                    [
                        createElement(
                            'div', // transtion div wrapper
                            [
                                createElement(
                                    'audio',
                                    {
                                        attrs: {id: 'audio', src: this.audioSrc}
                                    }
                                ),
                                createElement(
                                    'div',  // <div class="columns my-padding-2-top">  
                                    {
                                        class: ['columns', 'my-padding-2-top']
                                    },
                                    [
                                        createElement(
                                            'div', // <div class="column is-7">
                                            {
                                                class: this.col1Classes
                                            },
                                            [
                                                createElement('h1', this.$slots.col1)
                                            ]
                                        ),
                                        createElement(
                                            'div', // <div class="column is-offset-1">
                                            {
                                                class: this.col2Classes
                                            },
                                            [
                                                createElement('h1', this.$slots.col2)
                                            ]
                                        )
                                    ]
                                )
                            ]
                        )
                    ]
                )
            ]
        )
    }
})

Vue.component("side-menu", {
    props: ['passedTemplate', 'passedState'],
    data: function() {
        return {
            currentSectionSelector: 'content-zeroSelector'
        }
    },
    methods: {
        sideMenuHandler: function(section) {
            this.$emit('emit-state', section)
            
            if(document.getElementById(this.passedState.sectionReference + 'Selector')) {
                this.sectionSelectorHandler()
            }
        },

        sectionSelectorHandler: function() {
            if(this.currentSectionSelector) {
                gsap.to(this.currentSectionSelector, 0.2, {backgroundColor: '', color: '#262626'})
            }
            this.currentSectionSelector = document.getElementById(this.passedState.sectionReference + 'Selector')
            gsap.to(this.currentSectionSelector, 0.2, {backgroundColor: '#5f6c7b', color: 'white'})
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
                timeline.set(label, {text: "on", x: '-25px'}, 0.2)
                timeline.to(knob, 0.2, {x: '48px'}, 0.2)
                timeline.to(fill, 0.1, {backgroundColor: '#337AB7'}, 0.3)
            }

            if(this.passedState[type + 'Playing'] == false) {
                timeline.to(fill, 0.2, {backgroundColor: '#092940'}, 0.2)
                timeline.set(label, {text: "off", x: '0px'}, 0.2)
                timeline.to(knob, 0.2, {x: '0px'}, 0.2)
            }
        }
    },
    updated: function() {
        return this.sectionSelectorHandler()
    },
    mounted: function() {
        this.currentSectionSelector = document.getElementById(this.passedState.sectionReference + 'Selector')
        gsap.to(this.currentSectionSelector, 0.2, {backgroundColor: '#5f6c7b', color: 'white'})
    }
});

/***************************************************
 * Main Vue Instance (must be below all other code)
 ***************************************************/
var vueRoot = new Vue({
    el: "#vue-app",
    data: {
        state: {
            audioPlaying: false,
            sectionReference: 'content-one' // resolves to sectionId
        },
        template: [
            {
                labelName: 'Content',
                labelId: 'content',
                items: [
                    {
                        listName: 'Welcome',
                        listId: 'content-one'
                    },
                    {
                        listName: 'How it works',
                        listId: 'content-two'
                    },
                    {
                        listName: 'Process summary',
                        listId: 'content-three'
                    },
                    {
                        listName: 'Submitting',
                        listId: 'content-four'
                    },
                    {
                        listName: 'Message from the State agency',
                        listId: 'content-five'
                    }
                ]
            },
            {
                labelName: 'Files',
                labelId: 'files',
                items: [
                    {
                        listName: 'file one'
                    },
                    {
                        listName: 'file two'
                    }
                ]
            },
            {
                labelName: 'Links',
                labelId: 'links',
                items: [
                    {
                        listName: 'link one'
                    },
                    {
                        listName: 'link two'
                    }
                ]
            }
        ]
    },
    methods: {
        setState: function(section) {
            this.state.sectionReference = section
        },

        setMediaOptions: function() {
            this.state.audioPlaying = !this.state.audioPlaying
        }
    }
});

// computed: {
    //     currentModuleIndex: function() {
    //         var modulefilter = this.passedView.moduleReference
    //         return this.passedTemplate[0].modulesArray.findIndex(k => k.moduleId == modulefilter)
    //     },

    //     nextModuleId: function() {
    //         var nextModuleIndex = this.currentModuleIndex + 1
    //         return this.passedTemplate[0].modulesArray[nextModuleIndex].moduleId
    //     },

    //     currentSectionIndex: function() {
    //         var sectionfilter = this.passedView.sectionReference
    //         return this.passedTemplate[0].modulesArray[this.currentModuleIndex].sectionsArray.findIndex(k => k.sectionId == sectionfilter)
    //     },

    //     nextSectionId: function() {
    //         var nextSectionIndex = this.currentSectionIndex + 1
    //         return this.passedTemplate[0].modulesArray[this.currentModuleIndex].sectionsArray[nextSectionIndex].sectionId
    //     }
    // },