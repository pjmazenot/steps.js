class StepsJs {

    constructor(steps, options = {}) {

        console.log('-- init steps.js --');

        this.currentScroll = StepsJsTools.getScrollTop();
        this.steps = steps;
        this.options =  Object.assign({
            duration: 300,
            styles: {
                frame: {
                    borderWidth: 3,
                    borderColor: '#ff0000'
                },
                hint: {
                    borderWidth: 1,
                    borderColor: '#00ff00',
                    borderRadius: 5,
                    backgroundColor: '#dbffdb'
                }
            }
        }, options);
        this.options.interval = 5;

        // Get existing frame
        this.frame = document.getElementById('jsa-frame');

        // Get existing hint
        this.hint = document.getElementById('jsa-hint');

        // Declare listeners
        let self = this;
        window.onresize = function(event) {

            self.isResizing = true;

            setTimeout(function () {
                self.isResizing = false;
            }, 100);

            setTimeout(function () {
                if(!self.isResizing) {
                    self.moveFrame();
                    self.displayHint();
                }
            }, 150);

        };

        window.onscroll = function() {

            self.currentScroll = StepsJsTools.getScrollTop();

        };

        this.run();

    }

    run() {

        console.log('-- run --');

        // Init step process
        this.currentStepIndex = 0;

        // Run
        this.processStep('next');

    }

    processStep(direction = 'next') {

        if(direction === 'prev') {

        } else {

            this.currentStepIndex++;
            if(this.currentStepIndex > this.steps.length) {

                this.frame.style.opacity = '0';
                this.hint.style.opacity = '0';
                console.log('-- done --');
                return;

            } else {
                this.currentStep = this.steps[this.currentStepIndex - 1];
            }

        }

        console.log('-- process step ' + this.currentStepIndex + ' --');

        this.targetElem = document.getElementById(this.currentStep.elementId);

        this.moveFrame();
        this.displayHint();
        this.addStepTriggers(direction);

    }

    moveFrame() {

        // Create the frame if it's not already present in the DOM
        if(!this.frame) {

            this.frame = document.createElement('div');
            this.frame.setAttribute('id', 'jsa-frame');
            this.frame.setAttribute('style', 'pointer-events:none;');
            this.frame.style.position = 'absolute';
            this.frame.style.boxSizing = 'border-box';
            this.frame.style.border = this.options.styles.frame.borderWidth + 'px solid ' + this.options.styles.frame.borderColor;
            this.frame.style.opacity = '0';

            document.body.appendChild(this.frame);

        }

        // Get target position
        let targetPos = this.targetElem.getBoundingClientRect();

        // Get frame position and dimensions
        let framePos = this.frame.getBoundingClientRect();
        let framePosTop = framePos.top + this.currentScroll;
        let framePosLeft = framePos.left;
        let frameWidth = this.frame.offsetWidth;
        let frameHeight = this.frame.offsetHeight;

        // Get distances for animation
        let topDistance = targetPos.top + this.currentScroll - framePosTop;
        let leftDistance = targetPos.left - framePosLeft;
        let widthDistance = this.targetElem.offsetWidth - frameWidth;
        let heightDistance = this.targetElem.offsetHeight - frameHeight;

        // Get movement increment based on max distance and animation time
        let moveIncrementTop = topDistance / (this.options.duration / this.options.interval);
        let moveIncrementLeft = leftDistance / (this.options.duration / this.options.interval);
        let moveIncrementWidth = widthDistance / (this.options.duration / this.options.interval);
        let moveIncrementHeight = heightDistance / (this.options.duration / this.options.interval);

        // Position and resize the frame to match the target element
        let loop = 0;
        clearInterval(this.moveInterval);
        this.moveInterval = setInterval(
            (function(self, loop) {

                return function() {

                    if (++loop > self.options.duration / self.options.interval) {

                        clearInterval(self.moveInterval);

                        if(self.currentStepIndex === 1) {
                            self.frame.style.opacity = '1';
                        }

                    } else {

                        framePosTop += moveIncrementTop;
                        framePosLeft += moveIncrementLeft;
                        frameWidth += moveIncrementWidth;
                        frameHeight += moveIncrementHeight;

                        self.frame.style.top = framePosTop + 'px';
                        self.frame.style.left = framePosLeft + 'px';
                        self.frame.style.width = frameWidth + 'px';
                        self.frame.style.height = frameHeight + 'px';

                    }

                }

            })(this, loop)
            , this.options.interval
        );

    }

    displayHint() {

        // Create the hint if it's not already present in the DOM
        if(!this.hint) {

            // Hint title
            let hintTitle = document.createElement('div');
            hintTitle.setAttribute('id', 'jsa-hint-title');

            // Hint description
            let hintDescription = document.createElement('div');
            hintDescription.setAttribute('id', 'jsa-hint-description');

            // Hint
            this.hint = document.createElement('div');
            this.hint.setAttribute('id', 'jsa-hint');
            this.hint.style.position = 'absolute';
            this.hint.style.padding = '10px';
            this.hint.style.boxSizing = 'border-box';
            this.hint.style.border = this.options.styles.hint.borderWidth + 'px solid ' + this.options.styles.hint.borderColor;
            this.hint.style.borderRadius = this.options.styles.hint.borderRadius + 'px';
            this.hint.style.background = this.options.styles.hint.backgroundColor;
            this.hint.style.opacity = '0';
            this.hint.appendChild(hintTitle);
            this.hint.appendChild(hintDescription);

            document.body.appendChild(this.hint);

        }

        // Get target position
        let targetPos = this.targetElem.getBoundingClientRect();

        this.hint.style.top = (targetPos.top + this.currentScroll + this.targetElem.offsetHeight) + 'px';
        this.hint.style.left = (targetPos.left + this.targetElem.offsetWidth) + 'px';

        document.getElementById('jsa-hint-title').innerHTML = this.currentStep.title;
        document.getElementById('jsa-hint-description').innerHTML = this.currentStep.description;

        if(this.currentStepIndex === 1) {
            this.hint.style.opacity = '1';
        }

    }

    addStepTriggers(direction) {

        let self = this;

        // Force the array format for the list of next step triggers
        if(!(this.currentStep.triggerNext instanceof Array)) {
            this.currentStep.triggerNext = [this.currentStep.triggerNext];
        }

        // Define the callback called when the user perform the action triggering the next step
        function callback(e) {

            e.stopPropagation();

            let targetElement = e.target || e.srcElement;

            // Remove all events
            for(let i = 0 ; i < self.currentStep.triggerNext.length ; i++) {

                let eventName = self.currentStep.triggerNext[i];
                targetElement.removeEventListener(eventName, callback);

            }

            self.processStep(direction);

        }

        if(direction === 'prev') {

        } else {

            // Add listeners for next step
            for(let i = 0 ; i < this.currentStep.triggerNext.length ; i++) {

                let eventName = this.currentStep.triggerNext[i];
                this.targetElem.addEventListener(eventName, callback);

            }

        }

    }

}