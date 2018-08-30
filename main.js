var __Size__ = [1, 1, 2, 2, 4, 4, 4, 8, 0, 0];
var VMInstruction;
(function (VMInstruction) {
    VMInstruction[VMInstruction["kVAR_not_array"] = -1] = "kVAR_not_array";
    VMInstruction[VMInstruction["kDoubleArg"] = 0] = "kDoubleArg";
    VMInstruction[VMInstruction["CONV"] = 7] = "CONV";
    VMInstruction[VMInstruction["MUL"] = 8] = "MUL";
    VMInstruction[VMInstruction["DIV"] = 9] = "DIV";
    VMInstruction[VMInstruction["REM"] = 10] = "REM";
    VMInstruction[VMInstruction["MOD"] = 11] = "MOD";
    VMInstruction[VMInstruction["ADD"] = 12] = "ADD";
    VMInstruction[VMInstruction["SUB"] = 13] = "SUB";
    VMInstruction[VMInstruction["AND"] = 14] = "AND";
    VMInstruction[VMInstruction["OR"] = 15] = "OR";
    VMInstruction[VMInstruction["XOR"] = 16] = "XOR";
    VMInstruction[VMInstruction["NEG"] = 17] = "NEG";
    VMInstruction[VMInstruction["NOT"] = 18] = "NOT";
    VMInstruction[VMInstruction["SHL"] = 19] = "SHL";
    VMInstruction[VMInstruction["SHR"] = 20] = "SHR";
    VMInstruction[VMInstruction["SET"] = 21] = "SET";
    VMInstruction[VMInstruction["kBranchTarget"] = 32] = "kBranchTarget";
    VMInstruction[VMInstruction["kParam"] = 64] = "kParam";
    VMInstruction[VMInstruction["POP"] = 69] = "POP";
    VMInstruction[VMInstruction["kSingleArg"] = 128] = "kSingleArg";
    VMInstruction[VMInstruction["PUSH_IMMEDIATE"] = 132] = "PUSH_IMMEDIATE";
    VMInstruction[VMInstruction["DUP"] = 134] = "DUP";
    VMInstruction[VMInstruction["RET"] = 156] = "RET";
    VMInstruction[VMInstruction["EXIT"] = 157] = "EXIT";
    VMInstruction[VMInstruction["POPNULL"] = 158] = "POPNULL";
    VMInstruction[VMInstruction["BRANCH"] = 182] = "BRANCH";
    VMInstruction[VMInstruction["BTRUE"] = 183] = "BTRUE";
    VMInstruction[VMInstruction["BFALSE"] = 184] = "BFALSE";
    VMInstruction[VMInstruction["PUSHENV"] = 186] = "PUSHENV";
    VMInstruction[VMInstruction["POPENV"] = 187] = "POPENV";
    VMInstruction[VMInstruction["PUSH"] = 192] = "PUSH";
    VMInstruction[VMInstruction["PUSH_LOCAL"] = 193] = "PUSH_LOCAL";
    VMInstruction[VMInstruction["PUSH_GLOBAL"] = 194] = "PUSH_GLOBAL";
    VMInstruction[VMInstruction["PUSH_BUILTIN"] = 195] = "PUSH_BUILTIN";
    VMInstruction[VMInstruction["CALL"] = 217] = "CALL";
    VMInstruction[VMInstruction["BREAK"] = 255] = "BREAK";
    VMInstruction[VMInstruction["kVARIND_mask"] = 536870911] = "kVARIND_mask";
    VMInstruction[VMInstruction["kVAR_objind_embed"] = 536870912] = "kVAR_objind_embed";
    VMInstruction[VMInstruction["kVAR_objind_over"] = 1073741824] = "kVAR_objind_over";
})(VMInstruction || (VMInstruction = {}));
var VMType;
(function (VMType) {
    VMType[VMType["Double"] = 0] = "Double";
    VMType[VMType["Float"] = 1] = "Float";
    VMType[VMType["Int"] = 2] = "Int";
    VMType[VMType["Long"] = 3] = "Long";
    VMType[VMType["Bool"] = 4] = "Bool";
    VMType[VMType["Variable"] = 5] = "Variable";
    VMType[VMType["String"] = 6] = "String";
    VMType[VMType["Instance"] = 7] = "Instance";
    VMType[VMType["Delete"] = 8] = "Delete";
    VMType[VMType["Undefined"] = 9] = "Undefined";
    VMType[VMType["UnsignedInt"] = 10] = "UnsignedInt";
    VMType[VMType["Error"] = 15] = "Error";
})(VMType || (VMType = {}));
var VMScope;
(function (VMScope) {
    VMScope[VMScope["LOCAL"] = -7] = "LOCAL";
    VMScope[VMScope["NOTSPECIFIED"] = -6] = "NOTSPECIFIED";
    VMScope[VMScope["GLOBAL"] = -5] = "GLOBAL";
    VMScope[VMScope["NOONE"] = -4] = "NOONE";
    VMScope[VMScope["ALL"] = -3] = "ALL";
    VMScope[VMScope["OTHER"] = -2] = "OTHER";
    VMScope[VMScope["_SELF"] = -1] = "_SELF";
})(VMScope || (VMScope = {}));
var VMConditionCode;
(function (VMConditionCode) {
    VMConditionCode[VMConditionCode["CNONE"] = 0] = "CNONE";
    VMConditionCode[VMConditionCode["CLT"] = 1] = "CLT";
    VMConditionCode[VMConditionCode["CLE"] = 2] = "CLE";
    VMConditionCode[VMConditionCode["CEQ"] = 3] = "CEQ";
    VMConditionCode[VMConditionCode["CNE"] = 4] = "CNE";
    VMConditionCode[VMConditionCode["CGE"] = 5] = "CGE";
    VMConditionCode[VMConditionCode["CGT"] = 6] = "CGT";
})(VMConditionCode || (VMConditionCode = {}));
Array.prototype.peek = function () { return this[this.length - 1]; };
/*
LowerThan   = 1, // <
LTOrEqual   = 2, // <=
Equality    = 3, // ==
Inequality  = 4, // !=
GTOrEqual   = 5, // >=
GreaterThan = 6  // >
*/
var GM;
(function (GM) {
    /*********************/
    /*  GENERIC          */
    /*********************/
    var Buffer = /** @class */ (function () {
        function Buffer(GMData) {
            this.Size = GMData.byteLength;
            this.Data = GMData;
            this.Position = 0;
        }
        Buffer.prototype.Seek = function (Offset, _Base) {
            if (_Base === void 0) { _Base = 0 /* Start */; }
            switch (_Base) {
                case 0 /* Start */: {
                    this.Position = Offset;
                    return this.Position;
                }
                case 1 /* Current */: {
                    this.Position += Offset;
                    return this.Position;
                }
                case 2 /* End */: {
                    this.Position = (this.Size + Offset) % this.Size;
                    return this.Position;
                }
            }
        };
        Buffer.prototype.Peek = function (_Type, Offset, Count) {
            if (Offset === void 0) { Offset = this.Position; }
            if (Count === void 0) { Count = undefined; }
            switch (_Type) {
                case 0 /* u8 */: return this.Data.getUint8(Offset);
                case 1 /* s8 */: return this.Data.getInt8(Offset);
                case 2 /* u16 */: return this.Data.getUint16(Offset, true);
                case 3 /* s16 */: return this.Data.getInt16(Offset, true);
                case 4 /* u32 */: return this.Data.getUint32(Offset, true);
                case 5 /* s32 */: return this.Data.getInt32(Offset, true);
                case 6 /* f32 */: return this.Data.getFloat32(Offset, true);
                case 7 /* f64 */: return this.Data.getFloat64(Offset, true);
                case 8 /* string */: {
                    var _Return = "", _Offset = this.Position;
                    while (this.Peek(0 /* u8 */, _Offset) != 0x00) {
                        _Return += String.fromCharCode(this.Peek(_Offset++, 0 /* u8 */));
                    }
                    return _Return;
                }
                case 9 /* text */: {
                    var _Return = "";
                    for (var i = 0; i < Count; i++) {
                        _Return += String.fromCharCode(this.Peek(0 /* u8 */, Offset + i));
                    }
                    return _Return;
                }
            }
        };
        Buffer.prototype.Read = function (_Type, Count) {
            if (Count === void 0) { Count = undefined; }
            var _Return = this.Peek(_Type, this.Position, Count);
            this.Position += (_Type > 7 /* f64 */ ? (_Type == 8 /* string */ ? _Return.length + 1 : Count) : __Size__[_Type]);
            return _Return;
        };
        Buffer.prototype.Copy = function (Offset, _Size) {
            return new Buffer(new DataView(this.Data.buffer.slice(Offset, Offset + _Size)));
        };
        return Buffer;
    }());
    GM.Buffer = Buffer;
    /*********************/
    /*  READER           */
    /*********************/
    var Chunk = /** @class */ (function () {
        function Chunk(GMBuffer) {
            this.Name = GMBuffer.Read(9 /* text */, 4);
            this.Length = GMBuffer.Read(4 /* u32 */);
            this.Base = GMBuffer.Position;
        }
        return Chunk;
    }());
    GM.Chunk = Chunk;
    var Reader = /** @class */ (function () {
        function Reader(GMFile) {
            var _this = this;
            this.FileRead = undefined;
            this.FileData = undefined;
            this.FileReader = undefined;
            this.FileBuffer = undefined;
            this.FileChunks = {};
            this.FileRead = GMFile;
            this.FileReader = new FileReader();
            this.FileReader.onload = function () {
                _this.FileData = new DataView(_this.FileReader.result);
                _this.Read();
            };
            this.FileReader.readAsArrayBuffer(this.FileRead);
        }
        Reader.prototype.Read = function () {
            this.FileBuffer = new Buffer(this.FileData);
            var GMHeader = new Chunk(this.FileBuffer);
            if (GMHeader.Name == "FORM") {
                while (this.FileBuffer.Position < GMHeader.Base + GMHeader.Length) {
                    var GMChunk = new Chunk(this.FileBuffer);
                    this.FileChunks[GMChunk.Name] = GMChunk;
                    this.FileBuffer.Seek(GMChunk.Base + GMChunk.Length);
                }
                console.log(this.FileChunks);
                new Runner(this.FileBuffer, this.FileChunks);
            }
        };
        return Reader;
    }());
    GM.Reader = Reader;
    /*********************/
    /*  RUNNER           */
    /*********************/
    var Stringy = /** @class */ (function () {
        function Stringy(GMBuffer, GMOffset, GMValue) {
            if (GMBuffer === void 0) { GMBuffer = undefined; }
            if (GMOffset === void 0) { GMOffset = undefined; }
            if (GMValue === void 0) { GMValue = undefined; }
            if (GMBuffer == undefined) {
                this.Offset = GMOffset;
                this.Base = this.Offset + 4;
                this.Value = GMValue;
            }
            else {
                this.Offset = GMBuffer.Read(4 /* u32 */);
                this.Base = GMBuffer.Position;
                GMBuffer.Seek(this.Offset);
                this.Position = GMBuffer.Position + 4;
                this.Value = GMBuffer.Read(9 /* text */, GMBuffer.Read(4 /* u32 */));
            }
        }
        return Stringy;
    }());
    GM.Stringy = Stringy;
    var Code = /** @class */ (function () {
        function Code(GMBuffer, GMStrings) {
            this.Offset = GMBuffer.Read(4 /* u32 */);
            this.Base = GMBuffer.Position;
            GMBuffer.Seek(this.Offset);
            this.Name = GMStrings[GMBuffer.Read(4 /* u32 */)].Value;
            this.Length = GMBuffer.Read(4 /* u32 */);
            GMBuffer.Seek(4, 1 /* Current */);
            this.Position = GMBuffer.Position + GMBuffer.Peek(5 /* s32 */);
            this.Bytecode = GMBuffer.Copy(GMBuffer.Position + GMBuffer.Read(5 /* s32 */), this.Length);
        }
        return Code;
    }());
    GM.Code = Code;
    var Variable = /** @class */ (function () {
        function Variable(GMBuffer) {
            this.Offset = GMBuffer.Read(4 /* u32 */);
            GMBuffer.Seek(8, 1 /* Current */);
            this.Count = GMBuffer.Read(4 /* u32 */);
            this.First = GMBuffer.Read(4 /* u32 */) + 4;
        }
        return Variable;
    }());
    GM.Variable = Variable;
    var Functional = /** @class */ (function () {
        function Functional(GMBuffer) {
            this.Offset = GMBuffer.Read(4 /* u32 */);
            this.Count = GMBuffer.Read(4 /* u32 */);
            this.First = GMBuffer.Read(4 /* u32 */) + 4;
        }
        return Functional;
    }());
    GM.Functional = Functional;
    var Runner = /** @class */ (function () {
        function Runner(GMBuffer, GMChunks) {
            this.Stack = [];
            this.Strings = {};
            this.StringList = [];
            this.Code = {};
            this.Functions = {
                "show_debug_message": function (str) {
                    return console.log(str);
                },
                "show_message": function (str) {
                    return window.alert(str);
                },
                "show_message_async": function (str) {
                    return console.log(str);
                },
                "show_question": function (str) {
                    return window.confirm(str);
                },
                "get_string": function (str, def) {
                    return window.prompt(str, def);
                },
                "irandom": function (x) {
                    return Math.floor(Math.random() * (x + 1));
                },
                "string": function (val) {
                    return val.toString();
                },
                "real": function (val) {
                    return (typeof val == "string") ? parseFloat(val) : val;
                }
            };
            this.Buffer = GMBuffer;
            this.Buffer.Seek(0);
            this.Chunks = GMChunks;
            this.Run();
        }
        Runner.prototype.GetArguments = function (GMCount) {
            var _Return = [];
            for (var i = 0; i < GMCount; i++) {
                _Return.push(this.Stack.pop());
            }
            return _Return;
        };
        Runner.prototype.GetInstruction = function (GMInst) {
            // JavaScript is really weird with unsigned values.
            return ((GMInst >> 24) >>> 0) & 0xFF;
        };
        Runner.prototype.GetBytes = function (GMInst, Index, Count) {
            if (Count === void 0) { Count = 0xFF; }
            return ((GMInst >> Index) >>> 0) & Count;
        };
        Runner.prototype.Run = function () {
            // STRG
            this.Buffer.Seek(this.Chunks["STRG"].Base);
            for (var i = 0, _i = this.Buffer.Read(4 /* u32 */); i < _i; i++) {
                var GMString = new Stringy(this.Buffer);
                this.Strings[GMString.Position] = GMString;
                this.StringList.push(this.Strings[GMString.Position]);
                this.Buffer.Seek(GMString.Base);
            }
            // FUNC
            this.Buffer.Seek(this.Chunks["FUNC"].Base);
            for (var i = 0, _i = this.Buffer.Read(4 /* u32 */); i < _i; i++) {
                var GMFunction = new Functional(this.Buffer);
                if (GMFunction.Count > 0) {
                    while (--GMFunction.Count >= 0) {
                        this.Strings[GMFunction.First] = new Stringy(undefined, GMFunction.First, this.Strings[GMFunction.Offset].Value);
                        if (GMFunction.Count > 0) {
                            GMFunction.First += this.Buffer.Peek(4 /* u32 */, GMFunction.First) & 0xFFFF;
                        }
                    }
                }
            }
            // VARI
            this.Buffer.Seek(this.Chunks["VARI"].Base + 12);
            while (this.Buffer.Position < this.Chunks["VARI"].Base + this.Chunks["VARI"].Length) {
                var GMVariable = new Variable(this.Buffer);
                console.log(GMVariable);
                if (GMVariable.Offset != 0 && GMVariable.Count > 0) {
                    while (--GMVariable.Count >= 0) {
                        this.Strings[GMVariable.First] = new Stringy(undefined, GMVariable.First, this.Strings[GMVariable.Offset].Value);
                        if (GMVariable.Count > 0) {
                            GMVariable.First += this.Buffer.Peek(4 /* u32 */, GMVariable.First) & 0xFFFF;
                        }
                    }
                }
            }
            // CODE
            this.Buffer.Seek(this.Chunks["CODE"].Base);
            for (var i = 0, _i = this.Buffer.Read(4 /* u32 */); i < _i; i++) {
                var GMCode = new Code(this.Buffer, this.Strings);
                this.Code[GMCode.Name] = GMCode;
                this.Buffer.Seek(GMCode.Base);
            }
            // Debug
            console.log(this.Strings);
            //this.Call(this.Code["gml_Room_room0_Create"]);
        };
        Runner.prototype.Call = function (GMCode) {
            var _a;
            var GMBuffer = GMCode.Bytecode, GMVariables = {};
            GMBuffer.Seek(0);
            var aaa = new Date();
            while (GMBuffer.Position < GMBuffer.Size) {
                var GMInstruction = GMBuffer.Read(4 /* u32 */);
                console.log("Instruction: " + VMInstruction[this.GetInstruction(GMInstruction)] + ", Value=" + (GMInstruction).toString(16) + ", Position=" + (GMCode.Position + GMBuffer.Position));
                switch (this.GetInstruction(GMInstruction)) {
                    case VMInstruction.SET: {
                        var GMRight = this.Stack.pop(), GMLeft = this.Stack.pop();
                        switch (this.GetBytes(GMInstruction, 8, 0xFF)) {
                            case VMConditionCode.CEQ: {
                                this.Stack.push(GMLeft == GMRight);
                                break;
                            }
                            case VMConditionCode.CGT: {
                                this.Stack.push(GMLeft > GMRight);
                                break;
                            }
                            case VMConditionCode.CGE: {
                                this.Stack.push(GMLeft >= GMRight);
                                break;
                            }
                            case VMConditionCode.CLT: {
                                this.Stack.push(GMLeft < GMRight);
                                break;
                            }
                            case VMConditionCode.CLE: {
                                this.Stack.push(GMLeft <= GMRight);
                                break;
                            }
                            case VMConditionCode.CNE: {
                                this.Stack.push(GMLeft != GMRight);
                                break;
                            }
                        }
                        break;
                    }
                    case VMInstruction.BRANCH: {
                        GMBuffer.Seek(((GMInstruction & 0xFFF) - 1) * 4, 1 /* Current */);
                        break;
                    }
                    case VMInstruction.BTRUE: {
                        if (this.Stack.pop() == true) {
                            GMBuffer.Seek(((GMInstruction & 0xFFF) - 1) * 4, 1 /* Current */);
                        }
                        break;
                    }
                    case VMInstruction.BFALSE: {
                        if (this.Stack.pop() == false) {
                            GMBuffer.Seek(((GMInstruction & 0xFFF) - 1) * 4, 1 /* Current */);
                        }
                        break;
                    }
                    case VMInstruction.CALL: {
                        console.log("Call: " + this.Strings[GMCode.Base + GMBuffer.Position].Value);
                        this.Stack.push((_a = this.Functions)[this.Strings[GMCode.Base + GMBuffer.Position].Value].apply(_a, this.GetArguments(GMInstruction & 0xFFFF)));
                        GMBuffer.Seek(4, 1 /* Current */);
                        break;
                    }
                    case VMInstruction.PUSH: {
                        switch (this.GetBytes(GMInstruction, 16, 0xFF)) {
                            case VMType.Variable: {
                                /** Variable **/
                                this.Stack.push(GMVariables[this.Strings[GMCode.Position + GMBuffer.Position].Value]);
                                GMBuffer.Seek(4, 1 /* Current */);
                                break;
                            }
                            case VMType.String: {
                                /** String **/
                                this.Stack.push(this.StringList[GMBuffer.Read(4 /* u32 */)].Value);
                                break;
                            }
                            default: {
                                /** Unknown **/
                                console.log("Unhandled Type: " + VMType[this.GetBytes(GMInstruction, 16, 0xFF)]);
                                break;
                            }
                        }
                        break;
                    }
                    case VMInstruction.PUSH_IMMEDIATE: {
                        this.Stack.push(GMInstruction & 0xFFFF);
                        break;
                    }
                    case VMInstruction.PUSH_LOCAL: {
                        this.Stack.push(GMVariables[this.Strings[GMCode.Position + GMBuffer.Position].Value]);
                        GMBuffer.Seek(4, 1 /* Current */);
                        break;
                    }
                    case VMInstruction.POP: {
                        GMVariables[this.Strings[GMCode.Position + GMBuffer.Position].Value] = this.Stack.pop();
                        console.log(VMScope[(GMInstruction & 0xFFFF) - 65536]);
                        GMBuffer.Seek(4, 1 /* Current */);
                        break;
                    }
                    case VMInstruction.POPNULL: {
                        this.Stack.pop();
                        break;
                    }
                    case VMInstruction.ADD: {
                        var GMValue = this.Stack.pop();
                        this.Stack.push(this.Stack.pop() + GMValue);
                        break;
                    }
                    case VMInstruction.SUB: {
                        var GMValue = this.Stack.pop();
                        this.Stack.push(GMValue - this.Stack.pop());
                        break;
                    }
                    case VMInstruction.DIV: {
                        var GMValue = this.Stack.pop();
                        this.Stack.push(GMValue / this.Stack.pop());
                        break;
                    }
                    case VMInstruction.MUL: {
                        var GMValue = this.Stack.pop();
                        this.Stack.push(GMValue * this.Stack.pop());
                        break;
                    }
                    case VMInstruction.MOD: {
                        var GMValue = this.Stack.pop();
                        this.Stack.push(GMValue % this.Stack.pop());
                        break;
                    }
                    case VMInstruction.REM: {
                        var GMValue = this.Stack.pop();
                        this.Stack.push(GMValue % this.Stack.pop());
                        break;
                    }
                    case VMInstruction.SHL: {
                        var GMValue = this.Stack.pop();
                        this.Stack.push(GMValue << this.Stack.pop());
                        break;
                    }
                    case VMInstruction.SHR: {
                        var GMValue = this.Stack.pop();
                        this.Stack.push(GMValue >> this.Stack.pop());
                        break;
                    }
                    case VMInstruction.XOR: {
                        var GMValue = this.Stack.pop();
                        this.Stack.push(GMValue ^ this.Stack.pop());
                        break;
                    }
                    case VMInstruction.NOT: {
                        this.Stack.push(~this.Stack.pop());
                        break;
                    }
                    case VMInstruction.AND: {
                        var GMValue = this.Stack.pop();
                        this.Stack.push(GMValue & this.Stack.pop());
                        break;
                    }
                    case VMInstruction.OR: {
                        var GMValue = this.Stack.pop();
                        this.Stack.push(GMValue | this.Stack.pop());
                        break;
                    }
                }
            }
            console.log("Variables:", GMVariables);
            console.log("Time Elapsed:", (new Date()).getTime() - aaa.getTime());
        };
        return Runner;
    }());
    GM.Runner = Runner;
})(GM || (GM = {}));
var Main = /** @class */ (function () {
    function Main() {
    }
    Main.main = function () {
        new GM.Reader(document.getElementById("input").files[0]);
    };
    return Main;
}());
