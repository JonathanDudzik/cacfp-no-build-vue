'use strict';

Vue.component("point-modal", {
    props: ['passedScores'],
    data: function() {
        return {
            showModal: false,
            correctAnswer: null,
            incorrectAnswer: null,
            certReady: null,
        }
    },
    methods: {
        closeModal: function () {
            // on close return data back to default
            this.incorrectAnswer = null
            this.correctAnswer = null
            this.showModal = false
        }
    },
    watch: {
        // a change in currentScore means question was answered correctly (see addPoint func)
        'passedScores.currentScore': {
            handler: function() {
                this.incorrectAnswer = null
                this.correctAnswer = true
                if (this.passedScores.currentScore >= this.passedScores.possibleScore) {
                    this.certReady = true
                }
                this.showModal = true
            }
        },
        // a change in incorrectAnswers means question was not answered correctly (see addPoint func)
        'passedScores.incorrectAnswers': {
            handler: function() {
                this.correctAnswer = null
                this.incorrectAnswer = true
                this.showModal = true
            }
        }
    },
})

Vue.component("main-content", {
    props: ['audioSrc', 'passedState', 'col1Classes', 'col2Classes'],
    data: function() {
        return {
            currentAudioObject: null,
        }
    },
    methods: {
        manageMedia: function() {
            // manage pausing media
            if(this.currentAudioObject) {
                this.currentAudioObject.pause()
                this.currentAudioObject = null
            }
            
            // manage playing media
            if(this.passedState == true) {
                if(document.getElementById('audio')) {
                    var audio = document.getElementById('audio');
                    this.currentAudioObject = audio;
                    this.currentAudioObject.play();
                }
            }
            return
        },
    
        firstEnter: function(el, done) {
            gsap.fromTo(el, 0.3, {scale: 0, opacity: 0}, {scale: 1, opacity: 1, onComplete: function(){done()}})
        }
    },
    mounted: function() {
        this.manageMedia()
    },
    watch: {
        // this watcher is for the slider event
        passedState: {
            deep: true,
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
                                    'div',  // <div class="columns my-padding-2-top">  
                                    {
                                        class: ['columns']
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

Vue.component('audio-slider', {
    props: ['passedState'],
    methods: {
        sliderHandler: function() {
            this.$emit('emit-slider')
        },

        sliderAnimation: function () {
            TweenLite.defaultEase = Linear.easeNone
            var fill = '#audio-slider-fill'
            var label = '#audio-slider-label'
            var knob = '#audio-slider-knob'

            var timeline = new TimelineMax({})
            
            if(this.passedState == true) { 
                timeline.set(label, {text: "on", x: '-5px'}, 0.2)
                timeline.to(knob, 0.2, {x: '68px'}, 0.2)
                timeline.to(fill, 0.1, {backgroundColor: '#337AB7'}, 0.3)
            }

            if(this.passedState == false) {
                timeline.to(fill, 0.2, {backgroundColor: '#092940'}, 0.2)
                timeline.set(label, {text: "off", x: '0px'}, 0.2)
                timeline.to(knob, 0.2, {x: '0px'}, 0.2)
            }
        }
    },
    watch: {
        passedState: function () {
            this.sliderAnimation()
        }
    }
})

Vue.component("side-menu-content", {
    props: ['passedState', 'passedContent'],
    methods: {
        sideMenuHandler: function(section) {
            this.$emit('emit-state', section)
        },

        sectionSelectorHandler: function() {

            // remove the is-active class from each element
            this.$refs.item.forEach(function(el) {el.removeAttribute("class", "is-active")})
    
            // add the is-active class to the value that is selected
            // This unfortunitely does not work in IE11. Arrow functions are not supported and I cannot figure out how to
            // get the "this" scope into the find() method.
            // see "prototype.bind()" and https://michaelnthiessen.com/this-is-undefined/
            // Ignore this feature for now.
            // this.$refs.item.find(el => el.id == this.passedState).setAttribute("class", 'is-active')
        }
    },
    mounted: function() {
        return this.sectionSelectorHandler()
    },
    watch: {
        passedState: function () {
            this.sectionSelectorHandler()
        }
    }
});

Vue.component("side-menu-resources", {
    data: function() {
        return {
            resources: [
                {
                    labelName: 'Resources',
                    labelId: 'files',
                    items: [
                        {
                            listName: 'NC CACFP Home Page',
                            listId: 'non-content',
                            href: 'https://www.nutritionnc.com/snp/index.htm'
                        },
                        {
                            listName: '7 CFR PART 226.6',
                            listId: 'non-content',
                            href: 'https://www.ecfr.gov/cgi-bin/text-idx?SID=9c3a6681dbf6aada3632967c4bfeb030&mc=true&node=pt7.4.226&rgn=div5#se7.4.226_16'
                        },
                        {
                            listName: 'Corrective Action Document',
                            listId: 'non-content',
                            href: 'https://www.nutritionnc.com/snp/pdf/cacfp/forms/CAD-Form-10-20.docx'
                        },
                        {
                            listName: 'Corrective Action Document Checklist',
                            listId: 'non-content',
                            href: 'https://www.nutritionnc.com/snp/pdf/cacfp/forms/CAD-InstitutionChecklist-1019.docx'
                        }
                    ]
                }
            ],
        }
    }
});

Vue.component("side-menu-certificate", {
    data: function() {
        return {
            resources: [
                {
                    labelName: 'Certificate',
                    labelId: 'certificate',
                    items: [
                        {
                            listName: 'Download Certificate',
                            listId: 'non-content',
                            href: 'https://www.ecfr.gov/cgi-bin/text-idx?SID=9c3a6681dbf6aada3632967c4bfeb030&mc=true&node=pt7.4.226&rgn=div5#se7.4.226_16'
                        }
                    ]
                }
            ],
        }
    }
});

Vue.component("lateral-navigator", {
    props: ['passedContent', 'passedSectionRef'],
    methods: {
        navigateNext: function() {
            this.$emit('emit-navigate-next', this.nextModuleId)
            gsap.to(window, 0.5, {scrollTo: 0})
        }
    },
    computed: {
        // should these be named "modules?"
        currentModuleIndex: function () {
            var modulefilter = this.passedSectionRef
            return this.passedContent[0].items.findIndex(function(k) {k.listId == modulefilter})
        },

        nextModuleId: function() {
            var nextModuleIndex = this.currentModuleIndex + 1
            
            if(this.passedContent[0].items[nextModuleIndex]) {
                return this.passedContent[0].items[nextModuleIndex].listId
            }
        }
    }
})

/***************************************************
 * Main Vue Instance (must be below all other code)
 ***************************************************/
var vueRoot = new Vue({
    el: "#vue-app",
    data: {
        sections: [
            {
                labelName: 'Content',
                labelId: 'content',
                items: [
                    {
                        listName: 'Welcome',
                        listId: 'content-one'
                    },
                    {
                        listName: 'How it Works',
                        listId: 'content-two'
                    },
                    {
                        listName: 'Corrective Action Document',
                        listId: 'content-three'
                    },
                    {
                        listName: 'Quick Review',
                        listId: 'content-four'
                    },
                    {
                        listName: 'Submission in NC CARES',
                        listId: 'content-five'
                    },
                    {
                        listName: 'Addtional Points',
                        listId: 'content-six'
                    },
                    {
                        listName: 'Message from the State Agency',
                        listId: 'content-seven'
                    }
                ]
            }
        ],
        scores: {
            currentScore: 0,
            incorrectAnswers: 0,
            possibleScore: 30
        },

        state: {
            audioPlaying: false,
            sectionReference: 'content-one', // resolves to sectionId
        }
    },
    methods: {
        setState: function(section) {
            this.state.sectionReference = section
        },

        setMediaOptions: function() {
            this.state.audioPlaying = !this.state.audioPlaying
        },

        manageScore: function(number) {
            if (number >= 1) {
                this.scores.currentScore += number
            } else {
                this.scores.incorrectAnswers += 1
            }

        }
    }
});
