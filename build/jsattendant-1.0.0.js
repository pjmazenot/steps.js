class Assistant {

    constructor(steps, options = {}) {

        console.log('-- init assistant --');

        this.steps = steps;
        this.options =  Object.assign({
            duration: 200,
            interval: 5
        }, options);

        this.execute();

    }

    execute() {

        console.log('-- start assistant execution --');

        // Start first step
        this.processNextStep(1, this.steps[0]);

    }

    processNextStep(index, step) {

        if(index <= this.currentStep) {
            return;
        }

        console.log('-- process step ' + index + ' --');

        this.currentStep = index;
        var targetElem = document.getElementById(step.elementId);

        this.moveFrame(targetElem);
        this.addNextStepTrigger(targetElem, step);

    }

    moveFrame(targetElem) {

        // Get context
        var that = this;

        var frame = document.getElementById('jsa-frame');

        // Create the frame if it's not already present in the DOM
        if(!frame) {
            frame = document.createElement('div');
            frame.setAttribute('id', 'jsa-frame');
            frame.setAttribute('style', 'pointer-events:none;');
            frame.style.position = 'absolute';
            frame.style.boxSizing = 'border-box';
            frame.style.border = '3px solid #ff0000';
            document.body.appendChild(frame);
        }

        // Get target position
        var targetPos = targetElem.getBoundingClientRect();

        // Get frame position and dimensions
        var framePos = frame.getBoundingClientRect();
        var framePosTop = framePos.top;
        var framePosLeft = framePos.left;
        var frameWidth = frame.offsetWidth;
        var frameHeight = frame.offsetHeight;

        // Get distances for animation
        var topDistance = targetPos.top - framePosTop;
        var leftDistance = targetPos.left - framePosLeft;
        var widthDistance = targetElem.offsetWidth - frameWidth;
        var heightDistance = targetElem.offsetHeight - frameHeight;

        // Get movement increment based on max distance and animation time
        var moveIncrementTop = topDistance / (this.options.duration / this.options.interval);
        var moveIncrementLeft = leftDistance / (this.options.duration / this.options.interval);
        var moveIncrementWidth = widthDistance / (this.options.duration / this.options.interval);
        var moveIncrementHeight = heightDistance / (this.options.duration / this.options.interval);

        // Position and resize the frame to match the target element
        var moveInterval = setInterval(move, this.options.interval);
        var loop = 0;
        function move() {

            if (++loop > that.options.duration / that.options.interval) {
                clearInterval(moveInterval);
            } else {

                framePosTop += moveIncrementTop;
                framePosLeft += moveIncrementLeft;
                frameWidth += moveIncrementWidth;
                frameHeight += moveIncrementHeight;

                frame.style.top = framePosTop + 'px';
                frame.style.left = framePosLeft + 'px';
                frame.style.width = frameWidth + 'px';
                frame.style.height = frameHeight + 'px';

            }

        }

    }

    addNextStepTrigger(targetElem, step) {

        // Get context
        var that = this;

        // Add listener
        if(step.triggerNext == 'click' || step.triggerNext == 'change') {
            targetElem.addEventListener(step.triggerNext, function () {
                that.processNextStep(that.currentStep + 1, that.steps[that.currentStep]);
            });
        }

        // @TODO: end execution

    }

}