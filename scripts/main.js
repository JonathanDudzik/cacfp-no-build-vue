'use strict';

Vue.component("content-modal", {
    props: ['passedModalContent', 'passedShowModal'],
    // why wasn't data() reactive?
    computed: {
        isActive () {
            return this.passedShowModal
        },

        modalContent () {
            // add logic here to append a message if the certificate is avail
            return this.passedModalContent
        }
    },
    methods: {
        closeModal: function () {
            this.$emit('emit-close')
        }
    }
})

Vue.component("point-manager", {
    methods: {
        selectionHandler(number, content) {
            this.$emit('emit-point', number)
            this.$emit('emit-modal-state')
            this.$emit('emit-modal-content', content)
        }
    },
    render() {
        return this.$scopedSlots.default({
            selectionHandler: this.selectionHandler
            // incorrect: this.incorrectHandler
        })
    }
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
    mounted() {
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
    props: ['passedContent', 'passedFiles', 'passedLinks', 'passedState'],
    // data: function() {
    //     return {
    //         currentSectionSelector: 'content-oneSelector'
    //     }
    // },
    computed: {
        currentSection() {
            console.log(this.passedState.sectionReference)
            return this.passedState.sectionReference
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
            gsap.to(this.currentSectionSelector, 0.2, {backgroundColor: '', color: '#262626'})
            
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

Vue.component("lateral-navigator", {
    props: ['passedContent', 'passedSectionRef'],
    methods: {
        navigateNext() {
            this.$emit('emit-navigate-next', this.nextModuleId)
            
            this.currentSectionSelector = document.getElementById(this.passedSectionRef + 'Selector')
            // this.$emit('emit-state', currentSectionSelector)
            gsap.to(this.currentSectionSelector, 0.2, {backgroundColor: '', color: '#262626'})

            gsap.to(window, {duration: 0.5, scrollTo: 0})
        }
    },
    computed: {
        // should these be named "modules?"
        currentModuleIndex: function () {
            var modulefilter = this.passedSectionRef
            return this.passedContent[0].items.findIndex(k => k.listId == modulefilter)
        },

        nextModuleId: function() {
            var nextModuleIndex = this.currentModuleIndex + 1
            
            if(this.passedContent[0].items[nextModuleIndex]) {
                return this.passedContent[0].items[nextModuleIndex].listId
            }
        }
    },
    updated: function() {
        this.currentSectionSelector = document.getElementById(this.passedSectionRef + 'Selector')
        console.log(this.currentSectionSelector)
        gsap.to(this.currentSectionSelector, 0.2, {backgroundColor: '#5f6c7b', color: 'white'})
    }
})

/***************************************************
 * Main Vue Instance (must be below all other code)
 ***************************************************/
var vueRoot = new Vue({
    el: "#vue-app",
    data: {
        // I don't think content, files, or links need to be arrays (can they just be objects?)
        content: [
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

        files: [
            {
                labelName: 'Files',
                labelId: 'files',
                items: [
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

        links: [
            {
                labelName: 'Links',
                labelId: 'links',
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
                    }
                ]
            }
        ],

        scores: {
            currentScore: 0,
            passingScore: 10
        },

        state: {
            audioPlaying: false,
            sectionReference: 'content-one', // resolves to sectionId
            showModal: false,
            modalContent: 'Default modal message'
        }
    },
    methods: {
        setState: function(section) {
            this.state.sectionReference = section
        },

        setModalState: function () {
            this.state.showModal = !this.state.showModal
        },
        
        setModalContent: function (content) {
            this.state.modalContent = content
        },

        setMediaOptions: function() {
            this.state.audioPlaying = !this.state.audioPlaying
        },

        addPoint: function(number) {
            this.scores.currentScore += number
            if(this.scores.currentScore == this.scores.passingScore) {
                this.pushCert()
            }
        },

        pushCert: function() {
            this.files[0].items.push({
                listName: 'Certificate',
                listId: 'non-content',
                href: 'https://www.ecfr.gov/cgi-bin/text-idx?SID=9c3a6681dbf6aada3632967c4bfeb030&mc=true&node=pt7.4.226&rgn=div5#se7.4.226_16'
            })
        }
    }
});
