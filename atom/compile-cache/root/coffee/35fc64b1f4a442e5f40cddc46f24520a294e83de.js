(function() {
  module.exports = {
    autoToggle: {
      title: "Auto Toggle",
      description: "Toggle on start.",
      type: "boolean",
      "default": true,
      order: 1
    },
    comboMode: {
      type: "object",
      order: 2,
      properties: {
        enabled: {
          title: "Combo Mode - Enabled",
          description: "When enabled effects won't appear until reach the activation threshold.",
          type: "boolean",
          "default": true,
          order: 1
        },
        activationThreshold: {
          title: "Combo Mode - Activation Threshold",
          description: "Streak threshold to activate the power mode.",
          type: "array",
          "default": [20, 50, 100, 200, 500],
          items: {
            type: "integer",
            minimum: 1,
            maximum: 1000
          }
        },
        streakTimeout: {
          title: "Combo Mode - Streak Timeout",
          description: "Timeout to reset the streak counter. In seconds.",
          type: "integer",
          "default": 10,
          minimum: 1,
          maximum: 100
        },
        exclamationEvery: {
          title: "Combo Mode - Exclamation Every",
          description: "Shows an exclamation every streak count.",
          type: "integer",
          "default": 10,
          minimum: 1,
          maximum: 100
        },
        exclamationTexts: {
          title: "Combo Mode - Exclamation Texts",
          description: "Exclamations to show (randomized).",
          type: "array",
          "default": ["Super!", "Radical!", "Fantastic!", "Great!", "OMG", "Whoah!", ":O", "Nice!", "Splendid!", "Wild!", "Grand!", "Impressive!", "Stupendous!", "Extreme!", "Awesome!"]
        },
        opacity: {
          title: "Combo Mode - Opacity",
          description: "Opacity of the streak counter.",
          type: "number",
          "default": 0.6,
          minimum: 0,
          maximum: 1
        }
      }
    },
    particles: {
      type: "object",
      order: 3,
      properties: {
        enabled: {
          title: "Particles - Enabled",
          description: "Turn the particles on/off.",
          type: "boolean",
          "default": true,
          order: 1
        },
        colours: {
          type: "object",
          properties: {
            type: {
              title: "Colours",
              description: "Configure colour options",
              type: "string",
              "default": "cursor",
              "enum": [
                {
                  value: 'cursor',
                  description: 'Particles will be the colour at the cursor.'
                }, {
                  value: 'random',
                  description: 'Particles will have random colours.'
                }, {
                  value: 'fixed',
                  description: 'Particles will have a fixed colour.'
                }
              ],
              order: 1
            },
            fixed: {
              title: "Fixed colour",
              description: "Colour when fixed colour is selected",
              type: "color",
              "default": "#fff"
            }
          }
        },
        totalCount: {
          type: "object",
          properties: {
            max: {
              title: "Particles - Max Total",
              description: "The maximum total number of particles on the screen.",
              type: "integer",
              "default": 500,
              minimum: 0
            }
          }
        },
        spawnCount: {
          type: "object",
          properties: {
            min: {
              title: "Particles - Minimum Spawned",
              description: "The minimum (randomized) number of particles spawned on input.",
              type: "integer",
              "default": 5
            },
            max: {
              title: "Particles - Maximum Spawned",
              description: "The maximum (randomized) number of particles spawned on input.",
              type: "integer",
              "default": 15
            }
          }
        },
        size: {
          type: "object",
          properties: {
            min: {
              title: "Particles - Minimum Size",
              description: "The minimum (randomized) size of the particles.",
              type: "integer",
              "default": 2,
              minimum: 0
            },
            max: {
              title: "Particles - Maximum Size",
              description: "The maximum (randomized) size of the particles.",
              type: "integer",
              "default": 4,
              minimum: 0
            }
          }
        },
        effect: {
          title: "Effect",
          description: "Defines the effect.",
          type: "string",
          "default": "",
          order: 7
        }
      }
    },
    screenShake: {
      type: "object",
      order: 4,
      properties: {
        enabled: {
          title: "Screen Shake - Enabled",
          description: "Turn the shaking on/off.",
          type: "boolean",
          "default": true
        },
        minIntensity: {
          title: "Screen Shake - Minimum Intensity",
          description: "The minimum (randomized) intensity of the shake.",
          type: "integer",
          "default": 1,
          minimum: 0,
          maximum: 100
        },
        maxIntensity: {
          title: "Screen Shake - Maximum Intensity",
          description: "The maximum (randomized) intensity of the shake.",
          type: "integer",
          "default": 3,
          minimum: 0,
          maximum: 100
        }
      }
    },
    playAudio: {
      type: "object",
      order: 5,
      properties: {
        enabled: {
          title: "Play Audio - Enabled",
          description: "Play audio clip on/off.",
          type: "boolean",
          "default": false,
          order: 1
        },
        audioclip: {
          title: "Play Audio - Audioclip",
          description: "Which audio clip played at keystroke.",
          type: "string",
          "default": '../audioclips/gun.wav',
          "enum": [
            {
              value: '../audioclips/gun.wav',
              description: 'Gun'
            }, {
              value: '../audioclips/typewriter.wav',
              description: 'Type Writer'
            }, {
              value: 'customAudioclip',
              description: 'Custom Path'
            }
          ],
          order: 3
        },
        customAudioclip: {
          title: "Play Audio - Path to Audioclip",
          description: "Path to audioclip played at keystroke.",
          type: "string",
          "default": 'rocksmash.wav',
          order: 4
        },
        volume: {
          title: "Play Audio - Volume",
          description: "Volume of the audio clip played at keystroke.",
          type: "number",
          "default": 0.42,
          minimum: 0.0,
          maximum: 1.0,
          order: 2
        }
      }
    },
    excludedFileTypes: {
      order: 6,
      type: "object",
      properties: {
        excluded: {
          title: "Prohibit activate-power-mode from enabling on these file types:",
          description: "Use comma separated, lowercase values (i.e. \"html, cpp, css\")",
          type: "array",
          "default": ["."]
        }
      }
    },
    flow: {
      title: "Flow",
      description: "Defines the flow when typping.",
      type: "string",
      "default": "",
      order: 7
    },
    plugins: {
      type: "object",
      order: 8,
      properties: {}
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvY29uZmlnLXNjaGVtYS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsVUFBQSxFQUNFO01BQUEsS0FBQSxFQUFPLGFBQVA7TUFDQSxXQUFBLEVBQWEsa0JBRGI7TUFFQSxJQUFBLEVBQU0sU0FGTjtNQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFIVDtNQUlBLEtBQUEsRUFBTyxDQUpQO0tBREY7SUFPQSxTQUFBLEVBQ0U7TUFBQSxJQUFBLEVBQU0sUUFBTjtNQUNBLEtBQUEsRUFBTyxDQURQO01BRUEsVUFBQSxFQUNFO1FBQUEsT0FBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLHNCQUFQO1VBQ0EsV0FBQSxFQUFhLHlFQURiO1VBRUEsSUFBQSxFQUFNLFNBRk47VUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBSFQ7VUFJQSxLQUFBLEVBQU8sQ0FKUDtTQURGO1FBT0EsbUJBQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxtQ0FBUDtVQUNBLFdBQUEsRUFBYSw4Q0FEYjtVQUVBLElBQUEsRUFBTSxPQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxDQUFDLEVBQUQsRUFBSyxFQUFMLEVBQVMsR0FBVCxFQUFjLEdBQWQsRUFBbUIsR0FBbkIsQ0FIVDtVQUlBLEtBQUEsRUFDRTtZQUFBLElBQUEsRUFBTSxTQUFOO1lBQ0EsT0FBQSxFQUFTLENBRFQ7WUFFQSxPQUFBLEVBQVMsSUFGVDtXQUxGO1NBUkY7UUFpQkEsYUFBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLDZCQUFQO1VBQ0EsV0FBQSxFQUFhLGtEQURiO1VBRUEsSUFBQSxFQUFNLFNBRk47VUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEVBSFQ7VUFJQSxPQUFBLEVBQVMsQ0FK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QSxLQUFBLEVBQU8sQ0FOUDtTQTNCRjtPQUhGO0tBdEtGO0lBNE1BLGlCQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sQ0FBUDtNQUNBLElBQUEsRUFBTSxRQUROO01BRUEsVUFBQSxFQUNFO1FBQUEsUUFBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLGlFQUFQO1VBQ0EsV0FBQSxFQUFhLGlFQURiO1VBRUEsSUFBQSxFQUFNLE9BRk47VUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBQUMsR0FBRCxDQUhUO1NBREY7T0FIRjtLQTdNRjtJQXNOQSxJQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sTUFBUDtNQUNBLFdBQUEsRUFBYSxnQ0FEYjtNQUVBLElBQUEsRUFBTSxRQUZOO01BR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQUhUO01BSUEsS0FBQSxFQUFPLENBSlA7S0F2TkY7SUE2TkEsT0FBQSxFQUNFO01BQUEsSUFBQSxFQUFNLFFBQU47TUFDQSxLQUFBLEVBQU8sQ0FEUDtNQUVBLFVBQUEsRUFBWSxFQUZaO0tBOU5GOztBQURGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuICBhdXRvVG9nZ2xlOlxuICAgIHRpdGxlOiBcIkF1dG8gVG9nZ2xlXCJcbiAgICBkZXNjcmlwdGlvbjogXCJUb2dnbGUgb24gc3RhcnQuXCJcbiAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgIGRlZmF1bHQ6IHRydWVcbiAgICBvcmRlcjogMVxuXG4gIGNvbWJvTW9kZTpcbiAgICB0eXBlOiBcIm9iamVjdFwiXG4gICAgb3JkZXI6IDJcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgZW5hYmxlZDpcbiAgICAgICAgdGl0bGU6IFwiQ29tYm8gTW9kZSAtIEVuYWJsZWRcIlxuICAgICAgICBkZXNjcmlwdGlvbjogXCJXaGVuIGVuYWJsZWQgZWZmZWN0cyB3b24ndCBhcHBlYXIgdW50aWwgcmVhY2ggdGhlIGFjdGl2YXRpb24gdGhyZXNob2xkLlwiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgICAgb3JkZXI6IDFcblxuICAgICAgYWN0aXZhdGlvblRocmVzaG9sZDpcbiAgICAgICAgdGl0bGU6IFwiQ29tYm8gTW9kZSAtIEFjdGl2YXRpb24gVGhyZXNob2xkXCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiU3RyZWFrIHRocmVzaG9sZCB0byBhY3RpdmF0ZSB0aGUgcG93ZXIgbW9kZS5cIlxuICAgICAgICB0eXBlOiBcImFycmF5XCJcbiAgICAgICAgZGVmYXVsdDogWzIwLCA1MCwgMTAwLCAyMDAsIDUwMF1cbiAgICAgICAgaXRlbXM6XG4gICAgICAgICAgdHlwZTogXCJpbnRlZ2VyXCJcbiAgICAgICAgICBtaW5pbXVtOiAxXG4gICAgICAgICAgbWF4aW11bTogMTAwMFxuXG4gICAgICBzdHJlYWtUaW1lb3V0OlxuICAgICAgICB0aXRsZTogXCJDb21ibyBNb2RlIC0gU3RyZWFrIFRpbWVvdXRcIlxuICAgICAgICBkZXNjcmlwdGlvbjogXCJUaW1lb3V0IHRvIHJlc2V0IHRoZSBzdHJlYWsgY291bnRlci4gSW4gc2Vjb25kcy5cIlxuICAgICAgICB0eXBlOiBcImludGVnZXJcIlxuICAgICAgICBkZWZhdWx0OiAxMFxuICAgICAgICBtaW5pbXVtOiAxXG4gICAgICAgIG1heGltdW06IDEwMFxuXG4gICAgICBleGNsYW1hdGlvbkV2ZXJ5OlxuICAgICAgICB0aXRsZTogXCJDb21ibyBNb2RlIC0gRXhjbGFtYXRpb24gRXZlcnlcIlxuICAgICAgICBkZXNjcmlwdGlvbjogXCJTaG93cyBhbiBleGNsYW1hdGlvbiBldmVyeSBzdHJlYWsgY291bnQuXCJcbiAgICAgICAgdHlwZTogXCJpbnRlZ2VyXCJcbiAgICAgICAgZGVmYXVsdDogMTBcbiAgICAgICAgbWluaW11bTogMVxuICAgICAgICBtYXhpbXVtOiAxMDBcblxuICAgICAgZXhjbGFtYXRpb25UZXh0czpcbiAgICAgICAgdGl0bGU6IFwiQ29tYm8gTW9kZSAtIEV4Y2xhbWF0aW9uIFRleHRzXCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiRXhjbGFtYXRpb25zIHRvIHNob3cgKHJhbmRvbWl6ZWQpLlwiXG4gICAgICAgIHR5cGU6IFwiYXJyYXlcIlxuICAgICAgICBkZWZhdWx0OiBbXCJTdXBlciFcIiwgXCJSYWRpY2FsIVwiLCBcIkZhbnRhc3RpYyFcIiwgXCJHcmVhdCFcIiwgXCJPTUdcIiwgXCJXaG9haCFcIiwgXCI6T1wiLCBcIk5pY2UhXCIsIFwiU3BsZW5kaWQhXCIsIFwiV2lsZCFcIiwgXCJHcmFuZCFcIiwgXCJJbXByZXNzaXZlIVwiLCBcIlN0dXBlbmRvdXMhXCIsIFwiRXh0cmVtZSFcIiwgXCJBd2Vzb21lIVwiXVxuXG4gICAgICBvcGFjaXR5OlxuICAgICAgICB0aXRsZTogXCJDb21ibyBNb2RlIC0gT3BhY2l0eVwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIk9wYWNpdHkgb2YgdGhlIHN0cmVhayBjb3VudGVyLlwiXG4gICAgICAgIHR5cGU6IFwibnVtYmVyXCJcbiAgICAgICAgZGVmYXVsdDogMC42XG4gICAgICAgIG1pbmltdW06IDBcbiAgICAgICAgbWF4aW11bTogMVxuXG4gIHBhcnRpY2xlczpcbiAgICB0eXBlOiBcIm9iamVjdFwiXG4gICAgb3JkZXI6IDNcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgZW5hYmxlZDpcbiAgICAgICAgdGl0bGU6IFwiUGFydGljbGVzIC0gRW5hYmxlZFwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlR1cm4gdGhlIHBhcnRpY2xlcyBvbi9vZmYuXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICBvcmRlcjogMVxuXG4gICAgICBjb2xvdXJzOlxuICAgICAgICB0eXBlOiBcIm9iamVjdFwiXG4gICAgICAgIHByb3BlcnRpZXM6XG4gICAgICAgICAgdHlwZTpcbiAgICAgICAgICAgIHRpdGxlOiBcIkNvbG91cnNcIlxuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiQ29uZmlndXJlIGNvbG91ciBvcHRpb25zXCJcbiAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICAgICAgICAgIGRlZmF1bHQ6IFwiY3Vyc29yXCJcbiAgICAgICAgICAgIGVudW06IFtcbiAgICAgICAgICAgICAge3ZhbHVlOiAnY3Vyc29yJywgZGVzY3JpcHRpb246ICdQYXJ0aWNsZXMgd2lsbCBiZSB0aGUgY29sb3VyIGF0IHRoZSBjdXJzb3IuJ31cbiAgICAgICAgICAgICAge3ZhbHVlOiAncmFuZG9tJywgZGVzY3JpcHRpb246ICdQYXJ0aWNsZXMgd2lsbCBoYXZlIHJhbmRvbSBjb2xvdXJzLid9XG4gICAgICAgICAgICAgIHt2YWx1ZTogJ2ZpeGVkJywgZGVzY3JpcHRpb246ICdQYXJ0aWNsZXMgd2lsbCBoYXZlIGEgZml4ZWQgY29sb3VyLid9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgICBvcmRlcjogMVxuXG4gICAgICAgICAgZml4ZWQ6XG4gICAgICAgICAgICB0aXRsZTogXCJGaXhlZCBjb2xvdXJcIlxuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiQ29sb3VyIHdoZW4gZml4ZWQgY29sb3VyIGlzIHNlbGVjdGVkXCJcbiAgICAgICAgICAgIHR5cGU6IFwiY29sb3JcIlxuICAgICAgICAgICAgZGVmYXVsdDogXCIjZmZmXCJcblxuICAgICAgdG90YWxDb3VudDpcbiAgICAgICAgdHlwZTogXCJvYmplY3RcIlxuICAgICAgICBwcm9wZXJ0aWVzOlxuICAgICAgICAgIG1heDpcbiAgICAgICAgICAgIHRpdGxlOiBcIlBhcnRpY2xlcyAtIE1heCBUb3RhbFwiXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbWF4aW11bSB0b3RhbCBudW1iZXIgb2YgcGFydGljbGVzIG9uIHRoZSBzY3JlZW4uXCJcbiAgICAgICAgICAgIHR5cGU6IFwiaW50ZWdlclwiXG4gICAgICAgICAgICBkZWZhdWx0OiA1MDBcbiAgICAgICAgICAgIG1pbmltdW06IDBcblxuICAgICAgc3Bhd25Db3VudDpcbiAgICAgICAgdHlwZTogXCJvYmplY3RcIlxuICAgICAgICBwcm9wZXJ0aWVzOlxuICAgICAgICAgIG1pbjpcbiAgICAgICAgICAgIHRpdGxlOiBcIlBhcnRpY2xlcyAtIE1pbmltdW0gU3Bhd25lZFwiXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbWluaW11bSAocmFuZG9taXplZCkgbnVtYmVyIG9mIHBhcnRpY2xlcyBzcGF3bmVkIG9uIGlucHV0LlwiXG4gICAgICAgICAgICB0eXBlOiBcImludGVnZXJcIlxuICAgICAgICAgICAgZGVmYXVsdDogNVxuXG4gICAgICAgICAgbWF4OlxuICAgICAgICAgICAgdGl0bGU6IFwiUGFydGljbGVzIC0gTWF4aW11bSBTcGF3bmVkXCJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBtYXhpbXVtIChyYW5kb21pemVkKSBudW1iZXIgb2YgcGFydGljbGVzIHNwYXduZWQgb24gaW5wdXQuXCJcbiAgICAgICAgICAgIHR5cGU6IFwiaW50ZWdlclwiXG4gICAgICAgICAgICBkZWZhdWx0OiAxNVxuXG4gICAgICBzaXplOlxuICAgICAgICB0eXBlOiBcIm9iamVjdFwiXG4gICAgICAgIHByb3BlcnRpZXM6XG4gICAgICAgICAgbWluOlxuICAgICAgICAgICAgdGl0bGU6IFwiUGFydGljbGVzIC0gTWluaW11bSBTaXplXCJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBtaW5pbXVtIChyYW5kb21pemVkKSBzaXplIG9mIHRoZSBwYXJ0aWNsZXMuXCJcbiAgICAgICAgICAgIHR5cGU6IFwiaW50ZWdlclwiXG4gICAgICAgICAgICBkZWZhdWx0OiAyXG4gICAgICAgICAgICBtaW5pbXVtOiAwXG5cbiAgICAgICAgICBtYXg6XG4gICAgICAgICAgICB0aXRsZTogXCJQYXJ0aWNsZXMgLSBNYXhpbXVtIFNpemVcIlxuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG1heGltdW0gKHJhbmRvbWl6ZWQpIHNpemUgb2YgdGhlIHBhcnRpY2xlcy5cIlxuICAgICAgICAgICAgdHlwZTogXCJpbnRlZ2VyXCJcbiAgICAgICAgICAgIGRlZmF1bHQ6IDRcbiAgICAgICAgICAgIG1pbmltdW06IDBcblxuICAgICAgZWZmZWN0OlxuICAgICAgICB0aXRsZTogXCJFZmZlY3RcIlxuICAgICAgICBkZXNjcmlwdGlvbjogXCJEZWZpbmVzIHRoZSBlZmZlY3QuXCJcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIlxuICAgICAgICBkZWZhdWx0OiBcIlwiXG4gICAgICAgIG9yZGVyOiA3XG5cbiAgc2NyZWVuU2hha2U6XG4gICAgdHlwZTogXCJvYmplY3RcIlxuICAgIG9yZGVyOiA0XG4gICAgcHJvcGVydGllczpcbiAgICAgIGVuYWJsZWQ6XG4gICAgICAgIHRpdGxlOiBcIlNjcmVlbiBTaGFrZSAtIEVuYWJsZWRcIlxuICAgICAgICBkZXNjcmlwdGlvbjogXCJUdXJuIHRoZSBzaGFraW5nIG9uL29mZi5cIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiB0cnVlXG5cbiAgICAgIG1pbkludGVuc2l0eTpcbiAgICAgICAgdGl0bGU6IFwiU2NyZWVuIFNoYWtlIC0gTWluaW11bSBJbnRlbnNpdHlcIlxuICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbWluaW11bSAocmFuZG9taXplZCkgaW50ZW5zaXR5IG9mIHRoZSBzaGFrZS5cIlxuICAgICAgICB0eXBlOiBcImludGVnZXJcIlxuICAgICAgICBkZWZhdWx0OiAxXG4gICAgICAgIG1pbmltdW06IDBcbiAgICAgICAgbWF4aW11bTogMTAwXG5cbiAgICAgIG1heEludGVuc2l0eTpcbiAgICAgICAgdGl0bGU6IFwiU2NyZWVuIFNoYWtlIC0gTWF4aW11bSBJbnRlbnNpdHlcIlxuICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbWF4aW11bSAocmFuZG9taXplZCkgaW50ZW5zaXR5IG9mIHRoZSBzaGFrZS5cIlxuICAgICAgICB0eXBlOiBcImludGVnZXJcIlxuICAgICAgICBkZWZhdWx0OiAzXG4gICAgICAgIG1pbmltdW06IDBcbiAgICAgICAgbWF4aW11bTogMTAwXG5cbiAgcGxheUF1ZGlvOlxuICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICBvcmRlcjogNVxuICAgIHByb3BlcnRpZXM6XG4gICAgICBlbmFibGVkOlxuICAgICAgICB0aXRsZTogXCJQbGF5IEF1ZGlvIC0gRW5hYmxlZFwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlBsYXkgYXVkaW8gY2xpcCBvbi9vZmYuXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgb3JkZXI6IDFcblxuICAgICAgYXVkaW9jbGlwOlxuICAgICAgICB0aXRsZTogXCJQbGF5IEF1ZGlvIC0gQXVkaW9jbGlwXCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiV2hpY2ggYXVkaW8gY2xpcCBwbGF5ZWQgYXQga2V5c3Ryb2tlLlwiXG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICAgICAgZGVmYXVsdDogJy4uL2F1ZGlvY2xpcHMvZ3VuLndhdidcbiAgICAgICAgZW51bTogW1xuICAgICAgICAgIHt2YWx1ZTogJy4uL2F1ZGlvY2xpcHMvZ3VuLndhdicsIGRlc2NyaXB0aW9uOiAnR3VuJ31cbiAgICAgICAgICB7dmFsdWU6ICcuLi9hdWRpb2NsaXBzL3R5cGV3cml0ZXIud2F2JywgZGVzY3JpcHRpb246ICdUeXBlIFdyaXRlcid9XG4gICAgICAgICAge3ZhbHVlOiAnY3VzdG9tQXVkaW9jbGlwJywgZGVzY3JpcHRpb246ICdDdXN0b20gUGF0aCd9XG4gICAgICAgIF1cbiAgICAgICAgb3JkZXI6IDNcblxuICAgICAgY3VzdG9tQXVkaW9jbGlwOlxuICAgICAgICB0aXRsZTogXCJQbGF5IEF1ZGlvIC0gUGF0aCB0byBBdWRpb2NsaXBcIlxuICAgICAgICBkZXNjcmlwdGlvbjogXCJQYXRoIHRvIGF1ZGlvY2xpcCBwbGF5ZWQgYXQga2V5c3Ryb2tlLlwiXG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICAgICAgZGVmYXVsdDogJ3JvY2tzbWFzaC53YXYnXG4gICAgICAgIG9yZGVyOiA0XG5cbiAgICAgIHZvbHVtZTpcbiAgICAgICAgdGl0bGU6IFwiUGxheSBBdWRpbyAtIFZvbHVtZVwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlZvbHVtZSBvZiB0aGUgYXVkaW8gY2xpcCBwbGF5ZWQgYXQga2V5c3Ryb2tlLlwiXG4gICAgICAgIHR5cGU6IFwibnVtYmVyXCJcbiAgICAgICAgZGVmYXVsdDogMC40MlxuICAgICAgICBtaW5pbXVtOiAwLjBcbiAgICAgICAgbWF4aW11bTogMS4wXG4gICAgICAgIG9yZGVyOiAyXG5cbiAgZXhjbHVkZWRGaWxlVHlwZXM6XG4gICAgb3JkZXI6IDZcbiAgICB0eXBlOiBcIm9iamVjdFwiXG4gICAgcHJvcGVydGllczpcbiAgICAgIGV4Y2x1ZGVkOlxuICAgICAgICB0aXRsZTogXCJQcm9oaWJpdCBhY3RpdmF0ZS1wb3dlci1tb2RlIGZyb20gZW5hYmxpbmcgb24gdGhlc2UgZmlsZSB0eXBlczpcIlxuICAgICAgICBkZXNjcmlwdGlvbjogXCJVc2UgY29tbWEgc2VwYXJhdGVkLCBsb3dlcmNhc2UgdmFsdWVzIChpLmUuIFxcXCJodG1sLCBjcHAsIGNzc1xcXCIpXCJcbiAgICAgICAgdHlwZTogXCJhcnJheVwiXG4gICAgICAgIGRlZmF1bHQ6IFtcIi5cIl1cblxuICBmbG93OlxuICAgIHRpdGxlOiBcIkZsb3dcIlxuICAgIGRlc2NyaXB0aW9uOiBcIkRlZmluZXMgdGhlIGZsb3cgd2hlbiB0eXBwaW5nLlwiXG4gICAgdHlwZTogXCJzdHJpbmdcIlxuICAgIGRlZmF1bHQ6IFwiXCJcbiAgICBvcmRlcjogN1xuXG4gIHBsdWdpbnM6XG4gICAgdHlwZTogXCJvYmplY3RcIlxuICAgIG9yZGVyOiA4XG4gICAgcHJvcGVydGllczoge31cbiJdfQ==
