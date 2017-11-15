class Assistant {

    constructor(steps, options = {}) {

        console.log('-- init assistant --');

        this.steps = steps;
        this.options =  Object.assign({
            duration: 200,
            interval: 5,
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

        // Get existing frame
        this.frame = document.getElementById('jsa-frame');

        // Get existing hint
        this.hint = document.getElementById('jsa-hint');

        this.run();

    }

    run() {

        console.log('-- run assistant --');

        // Init step process
        this.currentStepIndex = 0;

        // Run
        this.processStep('next');

    }

    // @TODO: Add forced index?
    processStep(direction = 'next', forcedIndex) {

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
        this.addStepTrigger(direction);

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
        let framePosTop = framePos.top;
        let framePosLeft = framePos.left;
        let frameWidth = this.frame.offsetWidth;
        let frameHeight = this.frame.offsetHeight;

        // Get distances for animation
        let topDistance = targetPos.top - framePosTop;
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
        let moveInterval = setInterval(
            (function(self, loop) {

                return function() {

                    if (++loop > self.options.duration / self.options.interval) {

                        clearInterval(moveInterval);

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

        this.hint.style.top = (targetPos.top + this.targetElem.offsetHeight) + 'px';
        this.hint.style.left = (targetPos.left + this.targetElem.offsetWidth) + 'px';

        document.getElementById('jsa-hint-title').innerHTML = this.currentStep.title;
        document.getElementById('jsa-hint-description').innerHTML = this.currentStep.description;

        if(this.currentStepIndex === 1) {
            this.hint.style.opacity = '1';
        }

    }

    addStepTrigger(direction) {

        let self = this;

        function callback() {
            self.targetElem.removeEventListener('click', callback);
            self.processStep(direction);
        }

        if(direction === 'prev') {

        } else {

            // Add listener
            if(this.currentStep.triggerNext === 'click' || this.currentStep.triggerNext === 'change') {
                this.targetElem.addEventListener(this.currentStep.triggerNext, callback);
            }

        }

    }

}