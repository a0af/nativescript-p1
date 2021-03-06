"use strict";
var appModule = require("application");
var utils = require("utils/utils");
var FILE_CODE = 3554;
Object.defineProperty(exports, "__esModule", {
    value: true
});
var yourplugin_common_1 = require("./yourplugin.common");

var ProcessAnalysis = com.tool.sports.com.analysis.ProcessAnalysis;
var AnalysisListener = com.tool.sports.com.analysis.AnalysisListener;

var YourPlugin = (function (_super) {
    __extends(YourPlugin, _super);

    function YourPlugin() {
        this._android = new ProcessAnalysis();
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(YourPlugin.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    // start analysis
    YourPlugin.prototype.update = function () {
        try {
            this._android.startAnalysis();
        } catch (err) {
            console.log('Error in update: ' + err);
        }
    };
    // set callback for analysis
    YourPlugin.prototype.setNotyfy = function (callback) {
        return new Promise(function (resolve, reject) {
            try {
                // note that this is ONLY triggered when the user clicked the notification in the statusbar
                ProcessAnalysis.setOnAnalysisCallback(
                    new AnalysisListener({
                        success: function (notification) {
                            callback(JSON.parse(notification));
                        },
                        error: function (notification) {
                            callback(JSON.parse(notification));
                        },
                    })
                );
                resolve();
            } catch (ex) {
                console.log("Error in LocalNotifications.addOnMessageReceivedCallback: " + ex);
                reject(ex);
            }
        });
    };
    // start Calmness
    YourPlugin.prototype.startCalmness = function () {
        try {
            this._android.startCalm();
        } catch (err) {
            console.log('Error in update: ' + err);
        }
    };
    // start CSV export
    YourPlugin.prototype.startCSVExport = function () {
        try {
            this._android.startCSVExport();
        } catch (err) {
            console.log('Error in start csv export: ' + err);
        }
    };
    // stop CSV export
    YourPlugin.prototype.stopCSVExport = function () {
        try {
            this._android.stopCSVExport();
        } catch (err) {
            console.log('Error in stop csv export: ' + err);
        }
    };

    // set callback for Calmness
    YourPlugin.prototype.setCalmnessNotyfy = function (callback) {
        return new Promise(function (resolve, reject) {
            try {
                // note that this is ONLY triggered when the user clicked the notification in the statusbar
                ProcessAnalysis.setOnCalmnessCallback(
                    new AnalysisListener({
                        success: function (notification) {
                            callback(JSON.parse(notification));
                        },
                        error: function (notification) {
                            callback(JSON.parse(notification));
                        },
                    })
                );
                resolve();
            } catch (ex) {
                console.log("Error in LocalNotifications.addOnMessageReceivedCallback: " + ex);
                reject(ex);
            }
        });
    };

    YourPlugin.prototype.addEcgData = function (data) {
        try {
            this._android.addEcgData(data);
        } catch (err) {
            console.log('Error in update: ' + err);
        }
    };
    YourPlugin.prototype.show = function (callback) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var result = [];
            var intent = _this.setIntent();
            var previousResult = appModule.android.foregroundActivity.onActivityResult;
            appModule.android.foregroundActivity.onActivityResult = function (requestCode, resultCode, data) {
                appModule.android.foregroundActivity.onActivityResult = previousResult;
                //In the NoNonsense-FilePicker  it acts differently for api > 16 and api< 16 but as
                //nativescript not supports api < 16 yet, I removed that part :) .
                if (requestCode == FILE_CODE && resultCode == android.app.Activity.RESULT_OK) {
                    if (data.getBooleanExtra(com.nononsenseapps.filepicker.FilePickerActivity.EXTRA_ALLOW_MULTIPLE, false)) {
                        var clipData = data.getClipData();
                        if (clipData != null) {
                            for (var i = 0; i < clipData.getItemCount(); i++) {
                                var uri = clipData.getItemAt(i).getUri();
                                result.push(uri);
                            }
                            resolve(result);
                            // callback(result);
                        }
                    } else {
                        var uri = data.getData();
                        result.push(uri);
                        resolve(result);
                        // callback(result);
                    }
                } else {
                    resolve('not ok');
                    // callback('not ok');
                }
            };
            appModule.android.foregroundActivity.startActivityForResult(intent, FILE_CODE);
        });
    };
    YourPlugin.prototype.setIntent = function () {
        var i = new android.content.Intent(utils.ad.getApplicationContext(), com.nononsenseapps.filepicker.FilePickerActivity.class);
        //if you don't set, it will be default.
        if (this.allowMultiple)
            i.putExtra(com.nononsenseapps.filepicker.FilePickerActivity.EXTRA_ALLOW_MULTIPLE, this.allowMultiple);
        if (this.allowCreateDir)
            i.putExtra(com.nononsenseapps.filepicker.FilePickerActivity.EXTRA_ALLOW_CREATE_DIR, this.allowCreateDir);
        if (this.singleClick)
            i.putExtra(com.nononsenseapps.filepicker.FilePickerActivity.EXTRA_SINGLE_CLICK, this.singleClick);
        if (this.mode)
            i.putExtra(com.nononsenseapps.filepicker.FilePickerActivity.EXTRA_MODE, this.mode);
        if (this.startPath)
            i.putExtra(com.nononsenseapps.filepicker.FilePickerActivity.EXTRA_START_PATH, this.startPath);
        return i;
    };
    return YourPlugin;
}(yourplugin_common_1.Common));
exports.YourPlugin = YourPlugin;
//# sourceMappingURL=yourplugin.android.js.map