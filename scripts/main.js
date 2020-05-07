'use strict';

Vue.component("main-content", {
    props: ['audioSrc', 'passedState', 'sectionReference'],
    methods: {
        firstEnter: function(el, done) {
            gsap.fromTo (el, 0.5, {opacity: 0}, {opacity: 1})
            done()
        },
        
        firstLeave: function(el, done) {
            gsap.to (el, 0.5, {opacity: 0})
            done()
        }
    },
    render: function(createElement) {
        if(this.passedState.sectionReference == 'content-one') {
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
                                enter: this.firstEnter,
                                leave: this.firstLeave, 
                            }
                        },
                        [
                            createElement(
                                'div', 
                                {
                                    // empty data object
                                },
                                [
                                    createElement(
                                        'audio',
                                        {
                                          attrs: {id: 'audio', src: this.audioSrc}
                                        }
                                    ),
                                    this.$slots.default
                                ]
                            )
                        ]
                    )
                ]
            )
        } else {
            return createElement(
                'div', 
                {
                    class: ['column', 'is-10']
                }
            )
        }
    }
    
    // `<div class="column is-10">
    //     <transition
    //         appear 
    //         mode="in-out"
    //         v-bind:css="false"
    //         v-on:enter="firstEnter"
    //         v-on:leave="firstLeave">
    //         <div v-if="passedState.sectionReference == 'content-one'">
    //             <audio id='audio' src="audioSrc"></audio>
    //             <p>{{ sectionReference }}</p>
    //             <slot></slot>
    //         </div>
    //     </transition>
    // </div>`
})

Vue.component("side-menu", {
    props: ['passedTemplate', 'passedState'],
    data: function() {
        return {
            currentSectionSelector: null
        }
    },
    methods: {
        sideMenuHandler: function(section) {
            this.$emit('emit-state', section)

            this.$emit('emit-media-manager')
            
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
            audioPlaying: false,
            sectionReference: 'content-one' // resolves to sectionId
        },
        template: [
            {
                labelName: 'Content',
                labelId: 'content',
                items: [
                    {
                        listName: 'content one',
                        listId: 'content-one'
                    },
                    {
                        listName: 'content two',
                        listId: 'content-two'
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
        }
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