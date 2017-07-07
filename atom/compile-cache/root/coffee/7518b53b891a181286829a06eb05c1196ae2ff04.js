(function() {
  var ParticlesEffect, random;

  random = require("lodash.random");

  module.exports = ParticlesEffect = (function() {
    ParticlesEffect.prototype.particles = [];

    function ParticlesEffect(particleManager) {
      this.title = particleManager.title;
      this.description = particleManager.description;
      this.image = particleManager.image;
      this.particleManager = particleManager;
    }

    ParticlesEffect.prototype.init = function() {
      return this.reset();
    };

    ParticlesEffect.prototype.disable = function() {
      return this.reset();
    };

    ParticlesEffect.prototype.reset = function() {
      return this.particles = [];
    };

    ParticlesEffect.prototype.spawn = function(position, colorGenerate, input, randomSize, conf) {
      var base, numParticles, particle, results;
      this.conf = conf;
      numParticles = random(this.conf['spawnCount.min'], this.conf['spawnCount.max']);
      results = [];
      while (numParticles--) {
        if (this.particles.length >= this.conf['totalCount.max']) {
          this.particles.shift();
        }
        if (this.particleManager.create != null) {
          particle = this.particleManager.create(position.left, position.top, colorGenerate, randomSize);
        } else {
          particle = this.createParticle(position.left, position.top, colorGenerate, randomSize);
          if (typeof (base = this.particleManager).init === "function") {
            base.init(particle);
          }
        }
        results.push(this.particles.push(particle));
      }
      return results;
    };

    ParticlesEffect.prototype.createParticle = function(x, y, colorGenerate, randomSize) {
      return {
        x: x,
        y: y,
        alpha: 1,
        color: colorGenerate(),
        size: randomSize(),
        velocity: {
          x: -1 + Math.random() * 2,
          y: -3.5 + Math.random() * 2
        }
      };
    };

    ParticlesEffect.prototype.update = function() {
      var i, j, particle, ref, results;
      if (!this.particles.length) {
        return;
      }
      results = [];
      for (i = j = ref = this.particles.length - 1; ref <= 0 ? j <= 0 : j >= 0; i = ref <= 0 ? ++j : --j) {
        particle = this.particles[i];
        if (this.particleManager.isDone(particle)) {
          this.particles.splice(i, 1);
          continue;
        }
        results.push(this.particleManager.update(particle));
      }
      return results;
    };

    ParticlesEffect.prototype.animate = function(context) {
      var gco, i, j, particle, ref;
      if (!this.particles.length) {
        return;
      }
      gco = context.globalCompositeOperation;
      context.globalCompositeOperation = "lighter";
      for (i = j = ref = this.particles.length - 1; ref <= 0 ? j <= 0 : j >= 0; i = ref <= 0 ? ++j : --j) {
        particle = this.particles[i];
        this.particleManager.draw(particle, context);
      }
      return context.globalCompositeOperation = gco;
    };

    return ParticlesEffect;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvZWZmZWN0L3BhcnRpY2xlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsZUFBUjs7RUFFVCxNQUFNLENBQUMsT0FBUCxHQUF1Qjs4QkFDckIsU0FBQSxHQUFXOztJQUVFLHlCQUFDLGVBQUQ7TUFDWCxJQUFDLENBQUEsS0FBRCxHQUFTLGVBQWUsQ0FBQztNQUN6QixJQUFDLENBQUEsV0FBRCxHQUFlLGVBQWUsQ0FBQztNQUMvQixJQUFDLENBQUEsS0FBRCxHQUFTLGVBQWUsQ0FBQztNQUN6QixJQUFDLENBQUEsZUFBRCxHQUFtQjtJQUpSOzs4QkFNYixJQUFBLEdBQU0sU0FBQTthQUNKLElBQUMsQ0FBQSxLQUFELENBQUE7SUFESTs7OEJBR04sT0FBQSxHQUFTLFNBQUE7YUFDUCxJQUFDLENBQUEsS0FBRCxDQUFBO0lBRE87OzhCQUdULEtBQUEsR0FBTyxTQUFBO2FBQ0wsSUFBQyxDQUFBLFNBQUQsR0FBYTtJQURSOzs4QkFHUCxLQUFBLEdBQU8sU0FBQyxRQUFELEVBQVcsYUFBWCxFQUEwQixLQUExQixFQUFpQyxVQUFqQyxFQUE2QyxJQUE3QztBQUNMLFVBQUE7TUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRO01BQ1IsWUFBQSxHQUFlLE1BQUEsQ0FBTyxJQUFDLENBQUEsSUFBSyxDQUFBLGdCQUFBLENBQWIsRUFBZ0MsSUFBQyxDQUFBLElBQUssQ0FBQSxnQkFBQSxDQUF0QztBQUVmO2FBQU0sWUFBQSxFQUFOO1FBQ0UsSUFBc0IsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLElBQXFCLElBQUMsQ0FBQSxJQUFLLENBQUEsZ0JBQUEsQ0FBakQ7VUFBQSxJQUFDLENBQUEsU0FBUyxDQUFDLEtBQVgsQ0FBQSxFQUFBOztRQUNBLElBQUcsbUNBQUg7VUFDRSxRQUFBLEdBQVcsSUFBQyxDQUFBLGVBQWUsQ0FBQyxNQUFqQixDQUF3QixRQUFRLENBQUMsSUFBakMsRUFBdUMsUUFBUSxDQUFDLEdBQWhELEVBQXFELGFBQXJELEVBQW9FLFVBQXBFLEVBRGI7U0FBQSxNQUFBO1VBR0UsUUFBQSxHQUFXLElBQUMsQ0FBQSxjQUFELENBQWdCLFFBQVEsQ0FBQyxJQUF6QixFQUErQixRQUFRLENBQUMsR0FBeEMsRUFBNkMsYUFBN0MsRUFBNEQsVUFBNUQ7O2dCQUNLLENBQUMsS0FBTTtXQUp6Qjs7cUJBTUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFYLENBQWdCLFFBQWhCO01BUkYsQ0FBQTs7SUFKSzs7OEJBY1AsY0FBQSxHQUFnQixTQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sYUFBUCxFQUFzQixVQUF0QjthQUNkO1FBQUEsQ0FBQSxFQUFHLENBQUg7UUFDQSxDQUFBLEVBQUcsQ0FESDtRQUVBLEtBQUEsRUFBTyxDQUZQO1FBR0EsS0FBQSxFQUFPLGFBQUEsQ0FBQSxDQUhQO1FBSUEsSUFBQSxFQUFNLFVBQUEsQ0FBQSxDQUpOO1FBS0EsUUFBQSxFQUNFO1VBQUEsQ0FBQSxFQUFHLENBQUMsQ0FBRCxHQUFLLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBQSxHQUFnQixDQUF4QjtVQUNBLENBQUEsRUFBRyxDQUFDLEdBQUQsR0FBTyxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0IsQ0FEMUI7U0FORjs7SUFEYzs7OEJBVWhCLE1BQUEsR0FBUSxTQUFBO0FBQ04sVUFBQTtNQUFBLElBQVUsQ0FBSSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQXpCO0FBQUEsZUFBQTs7QUFFQTtXQUFTLDZGQUFUO1FBQ0UsUUFBQSxHQUFXLElBQUMsQ0FBQSxTQUFVLENBQUEsQ0FBQTtRQUV0QixJQUFHLElBQUMsQ0FBQSxlQUFlLENBQUMsTUFBakIsQ0FBd0IsUUFBeEIsQ0FBSDtVQUNFLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFrQixDQUFsQixFQUFxQixDQUFyQjtBQUNBLG1CQUZGOztxQkFJQSxJQUFDLENBQUEsZUFBZSxDQUFDLE1BQWpCLENBQXdCLFFBQXhCO0FBUEY7O0lBSE07OzhCQVlSLE9BQUEsR0FBUyxTQUFDLE9BQUQ7QUFDUCxVQUFBO01BQUEsSUFBVSxDQUFJLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBekI7QUFBQSxlQUFBOztNQUVBLEdBQUEsR0FBTSxPQUFPLENBQUM7TUFDZCxPQUFPLENBQUMsd0JBQVIsR0FBbUM7QUFFbkMsV0FBUyw2RkFBVDtRQUNFLFFBQUEsR0FBVyxJQUFDLENBQUEsU0FBVSxDQUFBLENBQUE7UUFFdEIsSUFBQyxDQUFBLGVBQWUsQ0FBQyxJQUFqQixDQUFzQixRQUF0QixFQUFnQyxPQUFoQztBQUhGO2FBS0EsT0FBTyxDQUFDLHdCQUFSLEdBQW1DO0lBWDVCOzs7OztBQXhEWCIsInNvdXJjZXNDb250ZW50IjpbInJhbmRvbSA9IHJlcXVpcmUgXCJsb2Rhc2gucmFuZG9tXCJcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQYXJ0aWNsZXNFZmZlY3RcbiAgcGFydGljbGVzOiBbXVxuXG4gIGNvbnN0cnVjdG9yOiAocGFydGljbGVNYW5hZ2VyKSAtPlxuICAgIEB0aXRsZSA9IHBhcnRpY2xlTWFuYWdlci50aXRsZVxuICAgIEBkZXNjcmlwdGlvbiA9IHBhcnRpY2xlTWFuYWdlci5kZXNjcmlwdGlvblxuICAgIEBpbWFnZSA9IHBhcnRpY2xlTWFuYWdlci5pbWFnZVxuICAgIEBwYXJ0aWNsZU1hbmFnZXIgPSBwYXJ0aWNsZU1hbmFnZXJcblxuICBpbml0OiAtPlxuICAgIEByZXNldCgpXG5cbiAgZGlzYWJsZTogLT5cbiAgICBAcmVzZXQoKVxuXG4gIHJlc2V0OiAtPlxuICAgIEBwYXJ0aWNsZXMgPSBbXVxuXG4gIHNwYXduOiAocG9zaXRpb24sIGNvbG9yR2VuZXJhdGUsIGlucHV0LCByYW5kb21TaXplLCBjb25mKSAtPlxuICAgIEBjb25mID0gY29uZlxuICAgIG51bVBhcnRpY2xlcyA9IHJhbmRvbSBAY29uZlsnc3Bhd25Db3VudC5taW4nXSwgQGNvbmZbJ3NwYXduQ291bnQubWF4J11cblxuICAgIHdoaWxlIG51bVBhcnRpY2xlcy0tXG4gICAgICBAcGFydGljbGVzLnNoaWZ0KCkgaWYgQHBhcnRpY2xlcy5sZW5ndGggPj0gQGNvbmZbJ3RvdGFsQ291bnQubWF4J11cbiAgICAgIGlmIEBwYXJ0aWNsZU1hbmFnZXIuY3JlYXRlP1xuICAgICAgICBwYXJ0aWNsZSA9IEBwYXJ0aWNsZU1hbmFnZXIuY3JlYXRlIHBvc2l0aW9uLmxlZnQsIHBvc2l0aW9uLnRvcCwgY29sb3JHZW5lcmF0ZSwgcmFuZG9tU2l6ZVxuICAgICAgZWxzZVxuICAgICAgICBwYXJ0aWNsZSA9IEBjcmVhdGVQYXJ0aWNsZSBwb3NpdGlvbi5sZWZ0LCBwb3NpdGlvbi50b3AsIGNvbG9yR2VuZXJhdGUsIHJhbmRvbVNpemVcbiAgICAgICAgQHBhcnRpY2xlTWFuYWdlci5pbml0PyhwYXJ0aWNsZSlcblxuICAgICAgQHBhcnRpY2xlcy5wdXNoIHBhcnRpY2xlXG5cbiAgY3JlYXRlUGFydGljbGU6ICh4LCB5LCBjb2xvckdlbmVyYXRlLCByYW5kb21TaXplKSAtPlxuICAgIHg6IHhcbiAgICB5OiB5XG4gICAgYWxwaGE6IDFcbiAgICBjb2xvcjogY29sb3JHZW5lcmF0ZSgpXG4gICAgc2l6ZTogcmFuZG9tU2l6ZSgpXG4gICAgdmVsb2NpdHk6XG4gICAgICB4OiAtMSArIE1hdGgucmFuZG9tKCkgKiAyXG4gICAgICB5OiAtMy41ICsgTWF0aC5yYW5kb20oKSAqIDJcblxuICB1cGRhdGU6IC0+XG4gICAgcmV0dXJuIGlmIG5vdCBAcGFydGljbGVzLmxlbmd0aFxuXG4gICAgZm9yIGkgaW4gW0BwYXJ0aWNsZXMubGVuZ3RoIC0gMSAuLjBdXG4gICAgICBwYXJ0aWNsZSA9IEBwYXJ0aWNsZXNbaV1cblxuICAgICAgaWYgQHBhcnRpY2xlTWFuYWdlci5pc0RvbmUgcGFydGljbGVcbiAgICAgICAgQHBhcnRpY2xlcy5zcGxpY2UgaSwgMVxuICAgICAgICBjb250aW51ZVxuXG4gICAgICBAcGFydGljbGVNYW5hZ2VyLnVwZGF0ZSBwYXJ0aWNsZVxuXG4gIGFuaW1hdGU6IChjb250ZXh0KSAtPlxuICAgIHJldHVybiBpZiBub3QgQHBhcnRpY2xlcy5sZW5ndGhcblxuICAgIGdjbyA9IGNvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uXG4gICAgY29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBcImxpZ2h0ZXJcIlxuXG4gICAgZm9yIGkgaW4gW0BwYXJ0aWNsZXMubGVuZ3RoIC0gMSAuLjBdXG4gICAgICBwYXJ0aWNsZSA9IEBwYXJ0aWNsZXNbaV1cblxuICAgICAgQHBhcnRpY2xlTWFuYWdlci5kcmF3IHBhcnRpY2xlLCBjb250ZXh0XG5cbiAgICBjb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IGdjb1xuIl19
