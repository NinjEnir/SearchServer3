(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, FolderView, ProjectBrowserView2, ProjectView, ProjectsStoreView, StoreView, boostrap, contextMenu, debug, projectBrowserTemplate, projectListTemplate, projectStoreListTemplate, projectStoreTemplate, projectTemplate, reqRes, rootTemplate, vent, _;
    $ = require('jquery');
    _ = require('underscore');
    boostrap = require('bootstrap');
    contextMenu = require('contextMenu');
    require('marionette');
    require('modelbinder');
    require('pickysitter');
    vent = require('core/messaging/appVent');
    reqRes = require('core/messaging/appReqRes');
    projectBrowserTemplate = require("text!./projectBrowser2.tmpl");
    rootTemplate = $(projectBrowserTemplate).filter('#projectBrowserTmpl');
    projectStoreListTemplate = _.template($(projectBrowserTemplate).filter('#projectStoreListTmpl').html());
    projectStoreTemplate = _.template($(projectBrowserTemplate).filter('#projectStoreTmpl').html());
    projectListTemplate = _.template($(projectBrowserTemplate).filter('#projectListTmpl').html());
    projectTemplate = _.template($(projectBrowserTemplate).filter('#projectTmpl').html());
    debug = false;
    ProjectBrowserView2 = (function(_super) {
      __extends(ProjectBrowserView2, _super);

      ProjectBrowserView2.prototype.template = rootTemplate;

      ProjectBrowserView2.prototype.regions = {
        projectStores: "#projectStores",
        projectFiles: "#projectFiles"
      };

      ProjectBrowserView2.prototype.ui = {
        fileNameInput: "#fileName",
        thumbNail: "#thumbNail",
        projectThumbNail: "#projectThumbNail",
        validationButton: "#validateOperationBtn",
        errorConsole: "#errorConsole",
        storesContainer: "#storesContainer",
        projectFiles: "#projectFiles"
      };

      ProjectBrowserView2.prototype.events = {
        "click .saveProject": "onProjectSaveRequested",
        "click .loadProject": "onProjectLoadRequested"
      };

      function ProjectBrowserView2(options) {
        this.onOperationSucceeded = __bind(this.onOperationSucceeded, this);
        this.onProjectLoadRequested = __bind(this.onProjectLoadRequested, this);
        this.onProjectSaveRequested = __bind(this.onProjectSaveRequested, this);
        this.onProjectSelected = __bind(this.onProjectSelected, this);
        this.onRender = __bind(this.onRender, this);
        var _ref, _ref1;
        ProjectBrowserView2.__super__.constructor.call(this, options);
        console.log("options");
        console.log(options.operation);
        this.operation = (_ref = options.operation) != null ? _ref : "save";
        this.stores = (_ref1 = options.stores) != null ? _ref1 : {};
        this.vent = vent;
        this.vent.on("project:created", this.onOperationSucceeded);
        this.vent.on("project:saved", this.onOperationSucceeded);
        this.vent.on("project:loaded", this.onOperationSucceeded);
        this.vent.on("project:selected", this.onProjectSelected);
      }

      ProjectBrowserView2.prototype.serializeData = function() {
        return {
          operation: this.operation,
          name: this.model.get("name")
        };
      };

      ProjectBrowserView2.prototype.onRender = function() {
        var doScreenShotRes, name, projectsStoreView, screenshotPromise, store, tmpCollection, _ref;
        tmpCollection = new Backbone.Collection();
        _ref = this.stores;
        for (name in _ref) {
          store = _ref[name];
          store.targetProject = this.model;
          tmpCollection.add(store);
        }
        this.stores = tmpCollection;
        projectsStoreView = new ProjectsStoreView({
          collection: tmpCollection,
          model: this.model
        });
        this.projectStores.show(projectsStoreView);
        if (this.operation === "save") {
          screenshotPromise = reqRes.request("project:getScreenshot");
          doScreenShotRes = (function(_this) {
            return function(screenshotUrl) {
              _this.ui.projectThumbNail.attr("src", screenshotUrl);
              _this.ui.thumbNail.removeClass("hide");
              return _this.model.addFile({
                name: ".thumbnail.png",
                content: screenshotUrl
              });
            };
          })(this);
          return $.when(screenshotPromise).done(doScreenShotRes);
        } else if (this.operation === "load") {
          return $(this.ui.fileNameInput).attr("readonly", "readonly");
        }
      };

      ProjectBrowserView2.prototype.onProjectSelected = function(projectName) {
        var onProjectFilesResponse;
        onProjectFilesResponse = (function(_this) {
          return function(entries) {
            var name, _i, _len;
            _this.ui.projectFiles.html("<ul></ul>");
            for (_i = 0, _len = projectNames.length; _i < _len; _i++) {
              name = projectNames[_i];
              _this.ui.projectFiles.append("<li><a href='#' >" + name + "  </a></li>");
            }
            _this.delegateEvents();
            return _this.ui.projectFiles.slimScroll({
              size: "10px",
              height: "300px",
              alwaysVisible: true
            });
          };
        })(this);
        return $(this.ui.fileNameInput).val(projectName);
      };

      ProjectBrowserView2.prototype.onProjectSaveRequested = function() {
        var fileName;
        fileName = this.ui.fileNameInput.val();
        return vent.trigger("project:saveRequest", fileName);
      };

      ProjectBrowserView2.prototype.onProjectLoadRequested = function() {
        var fileName;
        fileName = $(this.ui.fileNameInput).val();
        if (this.model.isSaveAdvised) {
          return bootbox.dialog("Project is unsaved, you will loose your changes, proceed anyway?", [
            {
              label: "Ok",
              "class": "btn-inverse",
              callback: (function(_this) {
                return function() {
                  return setTimeout((function() {
                    vent.trigger("project:loadRequest", fileName);
                    return _this.close();
                  }), 10);
                };
              })(this)
            }, {
              label: "Cancel",
              "class": "btn-inverse",
              callback: function() {}
            }
          ]);
        } else {
          vent.trigger("project:loadRequest", fileName);
          return this.close();
        }
      };

      ProjectBrowserView2.prototype.onOperationSucceeded = function() {
        return this.close();
      };

      ProjectBrowserView2.prototype.onClose = function() {
        this.vent.off("project:saved", this.onOperationSucceeded);
        this.vent.off("project:loaded", this.onOperationSucceeded);
        return this.vent.off("project:selected", (function(_this) {
          return function(id) {
            return $(_this.ui.fileNameInput).val(id);
          };
        })(this));
      };

      return ProjectBrowserView2;

    })(Backbone.Marionette.Layout);
    ProjectView = (function(_super) {
      __extends(ProjectView, _super);

      ProjectView.prototype.template = projectTemplate;

      function ProjectView(options) {
        this.onLoadRequested = __bind(this.onLoadRequested, this);
        this.onSaveRequested = __bind(this.onSaveRequested, this);
        this.onProjectSelected = __bind(this.onProjectSelected, this);
        this.onProjectRenameRequest = __bind(this.onProjectRenameRequest, this);
        this.onProjectDeleteRequest = __bind(this.onProjectDeleteRequest, this);
        this.store = options.store;
      }

      ProjectView.prototype.onProjectDeleteRequest = function() {
        return bootbox.dialog("Are you sure you want to delete <b>" + this.selectedModelName + "</b> ? There is no going back!", [
          {
            label: "Ok",
            "class": "btn-inverse",
            callback: (function(_this) {
              return function() {
                var onDeleted;
                onDeleted = function() {
                  $("#" + _this.model.name + _this.selectedModelName).parent().remove();
                  return $("#projectFilesList").html("");
                };
                return _this.store.deleteProject(_this.selectedModelName).done(onDeleted);
              };
            })(this)
          }, {
            label: "Cancel",
            "class": "btn-inverse",
            callback: function() {}
          }
        ]);
      };

      ProjectView.prototype.onProjectRenameRequest = function() {
        var onReallyRename, onRenameOk;
        onRenameOk = (function(_this) {
          return function(fileName) {
            var onFilesFetched;
            $("#" + _this.model.name + _this.selectedModelName).text("" + fileName);
            $("#" + _this.model.name + _this.selectedModelName).attr("id", fileName);
            _this.selectedModelName = fileName;
            onFilesFetched = function(files) {
              var ext, file, fullName, _i, _len, _results;
              $("#projectFilesList").html("");
              _results = [];
              for (_i = 0, _len = files.length; _i < _len; _i++) {
                file = files[_i];
                fullName = file.split('.');
                ext = fullName.pop();
                _results.push($("#projectFilesList").append("<tr><td>" + file + "</td><td>" + ext + "</td></tr>"));
              }
              return _results;
            };
            return _this.store.getProjectFiles(_this.selectedModelName).done(onFilesFetched);
          };
        })(this);
        onReallyRename = (function(_this) {
          return function(fileName) {
            var projectNameExists, projectToSave;
            console.log("renaming to " + fileName);
            projectToSave = _this.selectedModelName;
            projectNameExists = _this.model.getProject(fileName);
            if (projectNameExists != null) {
              return bootbox.dialog("A project called " + fileName + " already exists, overwrite?", [
                {
                  label: "Ok",
                  "class": "btn-inverse",
                  callback: function() {
                    return _this.store.renameProject(projectToSave, fileName).done(function() {
                      return onRenameOk(fileName);
                    });
                  }
                }, {
                  label: "Cancel",
                  "class": "btn-inverse",
                  callback: function() {}
                }
              ]);
            } else {
              return _this.store.renameProject(projectToSave, fileName).done(function() {
                return onRenameOk(fileName);
              });
            }
          };
        })(this);
        return bootbox.prompt("New name", "Cancel", "Rename", (function(_this) {
          return function(result) {
            if (result != null) {
              return onReallyRename(result);
            }
          };
        })(this), "" + this.selectedModelName);
      };

      ProjectView.prototype.onProjectSelected = function(e) {
        var error, onFilesFetched, onThumbNailFetched, projectName;
        this.trigger("store:selected", this.store);
        e.preventDefault();
        projectName = $(e.currentTarget).attr("id");
        projectName = projectName.split("" + this.model.name).pop();
        this.selectedModelName = projectName;
        vent.trigger("project:selected", projectName);
        this.trigger("project:selected", this.model);
        onFilesFetched = (function(_this) {
          return function(files) {
            var ext, file, fullName, _i, _len, _results;
            $("#projectFilesList").html("");
            _results = [];
            for (_i = 0, _len = files.length; _i < _len; _i++) {
              file = files[_i];
              fullName = file.split('.');
              ext = fullName.pop();
              _results.push($("#projectFilesList").append("<tr><td>" + file + "</td><td>" + ext + "</td></tr>"));
            }
            return _results;
          };
        })(this);
        this.model.getProjectFiles(projectName).done(onFilesFetched);
        try {
          onThumbNailFetched = (function(_this) {
            return function(imageUrl) {
              $("#thumbNail").html("<img id=\"projectThumbNail\" class=\"img-rounded\"/>");
              $("#projectThumbNail").attr("src", imageUrl);
              return $("#thumbNail").removeClass("hide");
            };
          })(this);
          $("#thumbNail").removeClass("hide");
          $("#thumbNail").html("<div style=\"height:100%;line-height:100px;\">&nbsp &nbsp<i class=\"icon-spinner icon-spin icon-large\"></i> Loading</div>");
          return this.model.getThumbNail(projectName).done(onThumbNailFetched);
        } catch (_error) {
          error = _error;
        }
      };

      ProjectView.prototype.onSaveRequested = function(fileName) {
        var projectNameExists, projectToSave;
        if (this.selected) {
          console.log("save to " + fileName + " requested");
          projectToSave = this.model.targetProject;
          projectNameExists = this.model.getProject(fileName);
          if (projectNameExists != null) {
            return bootbox.dialog("A project called " + fileName + " already exists, overwrite?", [
              {
                label: "Ok",
                "class": "btn-inverse",
                callback: (function(_this) {
                  return function() {
                    return _this.model.saveProject(projectToSave, fileName);
                  };
                })(this)
              }, {
                label: "Cancel",
                "class": "btn-inverse",
                callback: function() {}
              }
            ]);
          } else {
            if (projectToSave != null) {
              return this.model.saveProject(projectToSave, fileName);
            }
          }
        }
      };

      ProjectView.prototype.onLoadRequested = function(fileName) {
        if (this.selected) {
          return this.model.loadProject(fileName);
        }
      };

      return ProjectView;

    })(Backbone.Marionette.ItemView);
    FolderView = (function(_super) {
      __extends(FolderView, _super);

      function FolderView() {
        return FolderView.__super__.constructor.apply(this, arguments);
      }

      return FolderView;

    })(Backbone.Marionette.CompositeView);
    StoreView = (function(_super) {
      __extends(StoreView, _super);

      StoreView.prototype.template = projectStoreTemplate;

      StoreView.prototype.ui = {
        projects: "#projects"
      };

      StoreView.prototype.events = {
        "click .exportStore": "onStoreExportRequested",
        "click .store-header": "onStoreSelected"
      };

      function StoreView(options) {
        this.onProjectsFetched = __bind(this.onProjectsFetched, this);
        this.onSaveRequested = __bind(this.onSaveRequested, this);
        this.onStoreSelectToggled = __bind(this.onStoreSelectToggled, this);
        this.onStoreExportRequested = __bind(this.onStoreExportRequested, this);
        this.onStoreSelected = __bind(this.onStoreSelected, this);
        var selectable;
        StoreView.__super__.constructor.call(this, options);
        selectable = new Backbone.PickySitter.Selectable(this);
        _.extend(this, selectable);
        this.on("selected", this.onStoreSelectToggled);
        this.on("deselected", this.onStoreSelectToggled);
        this.selectedModelName = null;
        vent.on("project:newRequest", this.onCreateRequested);
        vent.on("project:saveRequest", this.onSaveRequested);
        vent.on("project:loadRequest", this.onLoadRequested);
        this.bindings = {
          loggedIn: [
            {
              selector: '.storeConnection',
              elAttribute: 'hidden'
            }
          ]
        };
        this.modelBinder = new Backbone.ModelBinder();
      }

      StoreView.prototype.onStoreSelected = function() {
        return this.trigger("store:selected");
      };

      StoreView.prototype.onStoreExportRequested = function(ev) {
        var fileName, packedDataUrl;
        $(".exportStore > i").removeClass("icon-download-alt");
        $(".exportStore > i").addClass("icon-spinner icon-spin");
        packedDataUrl = this.model.dumpAllProjects();
        if (packedDataUrl !== null) {
          fileName = "CoScadStoreExport.zip";
          if ($(".exportStore").prop("download") !== ("" + fileName)) {
            this.packedDataUrl = packedDataUrl;
            $(".exportStore").prop("download", "" + fileName);
            $(".exportStore").prop("href", packedDataUrl);
          }
        }
        $(".exportStore > i").removeClass("icon-spinner icon-spin");
        $(".exportStore > i").addClass("icon-download-alt");
        return true;
      };

      StoreView.prototype.onStoreSelectToggled = function() {
        var header;
        if (this.selected) {
          console.log("" + this.model.name + " selected");
          this.model.getProjectsName(this.onProjectsFetched);
          header = this.$el.find(".store-header");
          header.toggleClass('store-header-activated');
        } else {
          header = this.$el.find(".store-header");
          header.toggleClass('store-header-activated');
        }
        return true;
      };

      StoreView.prototype.onRender = function() {
        return console.log("getting projects from " + this.model.name);
      };

      StoreView.prototype.onSaveRequested = function(fileName) {
        var projectNameExists, projectToSave;
        if (this.selected) {
          console.log("save to " + fileName + " requested");
          projectToSave = this.model.targetProject;
          projectNameExists = this.model.getProject(fileName);
          if (projectNameExists != null) {
            return bootbox.dialog("A project called " + fileName + " already exists, overwrite?", [
              {
                label: "Ok",
                "class": "btn-inverse",
                callback: (function(_this) {
                  return function() {
                    return _this.model.saveProject(projectToSave, fileName);
                  };
                })(this)
              }, {
                label: "Cancel",
                "class": "btn-inverse",
                callback: function() {}
              }
            ]);
          } else {
            if (projectToSave != null) {
              return this.model.saveProject(projectToSave, fileName);
            }
          }
        }
      };

      StoreView.prototype.onProjectsFetched = function(projectNames) {
        var height, name, targetElem, _i, _len;
        this.rootFolderCollection = new Backbone.Collection();

        /* 
        for projectName in projectNames
          projectFolder = new Backbone.Model()
          @rootFolderCollection.add( projectFolder ) 
        
        projectsView = new ProjectsListView
          collection: @rootFolderCollection
         */
        targetElem = $("#projects");
        targetElem.html("");
        for (_i = 0, _len = projectNames.length; _i < _len; _i++) {
          name = projectNames[_i];
          targetElem.append("<li class='projectBlock'>\n<div class=\"flip\">\n  <div class=\"front\">\n    <table>\n      <thead>\n        <tr>\n          <th> \n            <div class=\"titleContainer\">\n            <a id='" + this.model.name + name + "' class='projectSelector' href='#' data-toggle='context' data-target='#" + this.model.name + "ProjectContextMenu'>" + name + "</a>\n            </div>\n          </th>\n        </tr>\n      </thead>\n    \n    </table>\n    \n  </div>\n  <div class=\"back\">\n    Some text here\n  </div>\n</div>\n</li>");
        }
        targetElem.on("click", (function(_this) {
          return function(event) {
            console.log("$(event.target)", $(event.target));
            console.log("closest", $(event.target).parent());
            return $(event.target).parent().toggleClass("flipped");
          };
        })(this));
        this.delegateEvents();
        height = 400;
        console.log("elem height", height);
        return targetElem.slimScroll({
          size: "10px",
          height: height + "px",
          alwaysVisible: true
        });
      };

      StoreView.prototype.onClose = function() {
        vent.off("project:saveRequest", this.onSaveRequested);
        vent.off("project:loadRequest", this.onLoadRequested);
        vent.off("store:selected", this.onStoreSelected);
        return this.modelBinder.unbind();
      };

      return StoreView;

    })(Backbone.Marionette.ItemView);
    ProjectsStoreView = (function(_super) {
      __extends(ProjectsStoreView, _super);

      ProjectsStoreView.prototype.template = projectStoreListTemplate;

      ProjectsStoreView.prototype.itemView = StoreView;

      function ProjectsStoreView(options) {
        this.onStoreViewSelected = __bind(this.onStoreViewSelected, this);
        this.onProjectSelected = __bind(this.onProjectSelected, this);
        var singleSelect;
        ProjectsStoreView.__super__.constructor.call(this, options);
        singleSelect = new Backbone.PickySitter.SingleSelect(this.itemViewContainer);
        _.extend(this, singleSelect);
        this.currentStore = null;
        this.on("itemview:project:selected", this.onProjectSelected);
        this.on("itemview:store:selected", this.onStoreViewSelected);
      }

      ProjectsStoreView.prototype.onProjectSelected = function(childView) {
        return this.trigger("project:selected");
      };

      ProjectsStoreView.prototype.onStoreViewSelected = function(childView) {
        this.currentStore = childView.model;
        return this.select(childView);
      };

      return ProjectsStoreView;

    })(Backbone.Marionette.CompositeView);
    return ProjectBrowserView2;
  });

}).call(this);
