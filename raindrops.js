
$.widget("water.raindrops", {
    options: {
        waveLength: 340,
        canvasWidth: 0,
        canvasHeight: 0,
        color: '#00aeef',
        frequency: 3,
        waveHeight: 100 ,
        density: 0.02,
        rippleSpeed:  0.1,
        rightPadding: 20,
        position:'absolute',
        positionBottom:0,
        positionLeft:0
    },
    _create: function () {
        var canvas = window.document.createElement('canvas');
        if (!this.options.canvasHeight) {
            this.options.canvasHeight = this.element.height() / 2;
        }
        if (!this.options.canvasWidth) {
            this.options.canvasWidth = this.element.width();
        }
        this.options.realWidth = this.options.canvasWidth + this.options.rightPadding;
        canvas.height = this.options.canvasHeight;
        canvas.width = this.options.realWidth;

        this.ctx = canvas.getContext('2d');
        this.ctx.fillStyle = this.options.color;
        this.element.append(canvas);
        canvas.parentElement.style.overflow = 'hidden';
        canvas.parentElement.style.position = 'relative';
        canvas.style.position = this.options.position;
        canvas.style.bottom = this.options.positionBottom;
        canvas.style.left = this.options.positionLeft;
        
        this.springs = [];
        for (var i = 0; i < this.options.waveLength; i++)
        {
            this.springs[i] = new this.Spring();
        }

        raindropsAnimationTick(this);
    },
    Spring: function ()
    {
        this.p = 0;
        this.v = 0;
        this.update = function (density, rippleSpeed)
        {
            this.v += (-rippleSpeed * this.p - density * this.v);
            this.p += this.v;
        };
    },
    updateSprings: function (spread) {
        var i;
        for (i = 0; i < this.options.waveLength; i++)
        {
            this.springs[i].update(this.options.density, this.options.rippleSpeed);
        }

        var leftDeltas = [],
                rightDeltas = [];

        for (var t = 0; t < 8; t++) {

            for (i = 0; i < this.options.waveLength; i++)
            {
                if (i > 0)
                {
                    leftDeltas[i] = spread * (this.springs[i].p - this.springs[i - 1].p);
                    this.springs[i - 1].v += leftDeltas[i];
                }
                if (i < this.options.waveLength - 1)
                {
                    rightDeltas[i] = spread * (this.springs[i].p - this.springs[i + 1].p);
                    this.springs[i + 1].v += rightDeltas[i];
                }
            }

            for (i = 0; i < this.options.waveLength; i++)
            {
                if (i > 0)
                    this.springs[i - 1].p += leftDeltas[i];
                if (i < this.options.waveLength - 1)
                    this.springs[i + 1].p += rightDeltas[i];
            }

        }

    },
    renderWaves: function ()
    {
        var i;
        this.ctx.fillStyle = this.options.color; 
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.options.canvasHeight);
        for (i = 0; i < this.options.waveLength; i++)
        {
            this.ctx.lineTo(i * (this.options.realWidth / this.options.waveLength), (this.options.canvasHeight / 2) + this.springs[i].p);
        }
        this.ctx.lineTo(this.options.realWidth, this.options.canvasHeight);
        this.ctx.fill();
    } 
    
});

function raindropsAnimationTick(drop) {
    if ((Math.random() * 100) < drop.options.frequency) {
        drop.springs[Math.floor(Math.random() * drop.options.waveLength)].p = drop.options.waveHeight;
        
        var soundIndex = Math.floor(Math.random() * 6) + 1;
        var raindropSound = new Audio('./drop/' + 'r' + soundIndex + '.mp3');
        raindropSound.play();
    }

    drop.ctx.clearRect(0, 0, drop.options.realWidth, drop.options.canvasHeight);
    drop.updateSprings(0.1);
    drop.renderWaves();

    requestAnimationFrame(function () {
        raindropsAnimationTick(drop);
    });
}

