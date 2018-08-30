const __Size__ = [1,1,2,2,4,4,4,8,0,0];
const enum Type { u8, s8, u16, s16, u32, s32, f32, f64, string, text }
const enum Base { Start, Current, End }
enum VMInstruction { kVAR_not_array = -1, kDoubleArg = 0, CONV = 7, MUL = 8, DIV = 9, REM = 10, MOD = 11, ADD = 12, SUB = 13, AND = 14, OR = 15, XOR = 16, NEG = 17, NOT = 18, SHL = 19, SHR = 20, SET = 21, kBranchTarget = 32, kParam = 64, POP = 69, kSingleArg = 128, PUSH_IMMEDIATE = 132, DUP = 134, RET = 156, EXIT = 157, POPNULL = 158, BRANCH = 182, BTRUE = 183, BFALSE = 184, PUSHENV = 186, POPENV = 187, PUSH = 192, PUSH_LOCAL = 193, PUSH_GLOBAL = 194, PUSH_BUILTIN = 195, CALL = 217, BREAK = 255, kVARIND_mask = 536870911, kVAR_objind_embed = 536870912, kVAR_objind_over = 1073741824 }
enum VMType { Double = 0, Float = 1, Int = 2, Long = 3, Bool = 4, Variable = 5, String = 6, Instance = 7, Delete = 8, Undefined = 9, UnsignedInt = 10, Error = 15 }
enum VMScope { LOCAL = -7, NOTSPECIFIED = -6, GLOBAL = -5, NOONE = -4, ALL = -3, OTHER = -2, _SELF = -1 }
enum VMConditionCode { CNONE = 0, CLT = 1, CLE = 2, CEQ = 3, CNE = 4, CGE = 5, CGT = 6 }
interface Array<T>{peek(this):any;}Array.prototype.peek=function(){return this[this.length-1];}
/*
LowerThan   = 1, // <
LTOrEqual   = 2, // <=
Equality    = 3, // ==
Inequality  = 4, // !=
GTOrEqual   = 5, // >=
GreaterThan = 6  // >
*/
namespace GM {
    /*********************/
    /*  GENERIC          */
    /*********************/
    export class Buffer {
        Size: number;
        Data: DataView;
        Position: number;

        constructor(GMData: DataView) {
            this.Size = GMData.byteLength;
            this.Data = GMData;
            this.Position = 0;
        }

        Seek(Offset, _Base:Base=Base.Start) {
            switch (_Base) {
                case Base.Start: {
                    this.Position = Offset;
                    return this.Position;
                }

                case Base.Current: {
                    this.Position += Offset;
                    return this.Position;
                }

                case Base.End: {
                    this.Position = (this.Size + Offset) % this.Size;
                    return this.Position;
                }
            }
        }

        Peek(_Type: Type, Offset=this.Position, Count: number=undefined):string|number {
            switch (_Type) {
                case Type.u8: return this.Data.getUint8(Offset);
                case Type.s8: return this.Data.getInt8(Offset);
                case Type.u16: return this.Data.getUint16(Offset, true);
                case Type.s16: return this.Data.getInt16(Offset, true);
                case Type.u32: return this.Data.getUint32(Offset, true);
                case Type.s32: return this.Data.getInt32(Offset, true);
                case Type.f32: return this.Data.getFloat32(Offset, true);
                case Type.f64: return this.Data.getFloat64(Offset, true);
                case Type.string: {
                    let _Return = "", _Offset = this.Position;
                    while (this.Peek(Type.u8, _Offset) != 0x00) {
                        _Return += String.fromCharCode(this.Peek(_Offset++, Type.u8) as number);
                    }
                    return _Return;
                }

                case Type.text: {
                    let _Return = "";
                    for(let i = 0; i < Count; i++) {
                        _Return += String.fromCharCode(this.Peek(Type.u8, Offset + i) as number);
                    }
                    return _Return;
                }
            }
        }

        Read(_Type: Type, Count: number=undefined):string|number {
            let _Return = this.Peek(_Type, this.Position, Count);
            this.Position += (_Type > Type.f64 ? (_Type == Type.string ? (_Return as String).length + 1 : Count) : __Size__[_Type]);
            return _Return;
        }

        Copy(Offset: number, _Size: number):Buffer {
            return new Buffer(new DataView(this.Data.buffer.slice(Offset, Offset + _Size)));
        }
    }

    /*********************/
    /*  READER           */
    /*********************/
    export class Chunk {
        Name: string;
        Length: number;
        Base: number;

        constructor(GMBuffer: Buffer) {
            this.Name = GMBuffer.Read(Type.text, 4) as string;
            this.Length = GMBuffer.Read(Type.u32) as number;
            this.Base = GMBuffer.Position;
        }
    }

    export class Reader {
        FileRead: File = undefined;
        FileData: DataView = undefined;
        FileReader: FileReader = undefined;
        FileBuffer: Buffer = undefined;
        FileChunks: object = {};

        constructor(GMFile: File) {
            this.FileRead = GMFile;
            this.FileReader = new FileReader();
            this.FileReader.onload = () => {
                this.FileData = new DataView(this.FileReader.result as ArrayBuffer);
                this.Read();
            }
            this.FileReader.readAsArrayBuffer(this.FileRead);
        }

        Read():void {
            this.FileBuffer = new Buffer(this.FileData);
            let GMHeader = new Chunk(this.FileBuffer);
            if (GMHeader.Name == "FORM") {
                while (this.FileBuffer.Position < GMHeader.Base + GMHeader.Length) {
                    let GMChunk = new Chunk(this.FileBuffer);
                    this.FileChunks[GMChunk.Name] = GMChunk;
                    this.FileBuffer.Seek(GMChunk.Base + GMChunk.Length);
                }
                console.log(this.FileChunks);
                new Runner(this.FileBuffer, this.FileChunks);
            }
        }
    }

    /*********************/
    /*  RUNNER           */
    /*********************/
    export class Stringy {
        Position: number;
        Offset: number;
        Value: string;
        Base: number;

        constructor(GMBuffer: Buffer=undefined, GMOffset: number=undefined, GMValue: string=undefined) {
            if (GMBuffer == undefined) {
                this.Offset = GMOffset;
                this.Base = this.Offset + 4;
                this.Value = GMValue;
            } else {
                this.Offset = GMBuffer.Read(Type.u32) as number;
                this.Base = GMBuffer.Position;
                GMBuffer.Seek(this.Offset);
                this.Position = GMBuffer.Position + 4;
                this.Value = GMBuffer.Read(Type.text, GMBuffer.Read(Type.u32) as number) as string;
            }
        }
    }

    export class Code {
        Offset: number;
        Name: string;
        Length: number;
        Bytecode: Buffer;
        Base: number;
        Position: number;

        constructor(GMBuffer: Buffer, GMStrings: object) {
            this.Offset = GMBuffer.Read(Type.u32) as number;
            this.Base = GMBuffer.Position;
            GMBuffer.Seek(this.Offset);
            this.Name = GMStrings[GMBuffer.Read(Type.u32)].Value;
            this.Length = GMBuffer.Read(Type.u32) as number;
            GMBuffer.Seek(4, Base.Current);
            this.Position = GMBuffer.Position + (GMBuffer.Peek(Type.s32) as number);
            this.Bytecode = GMBuffer.Copy(GMBuffer.Position + (GMBuffer.Read(Type.s32) as number), this.Length);
        }
    }

    export class Variable {
        Offset: number;
        Count: number;
        First: number;

        constructor(GMBuffer: Buffer) {
            this.Offset = GMBuffer.Read(Type.u32) as number;
            GMBuffer.Seek(8, Base.Current);
            this.Count = GMBuffer.Read(Type.u32) as number;
            this.First = (GMBuffer.Read(Type.u32) as number) + 4;
        }
    }

    export class Script {
        Offset: number;
        Base: number;

        constructor(GMBuffer: Buffer) {
            this.Offset = GMBuffer.Read(Type.u32) as number;
            this.Base = GMBuffer.Position;
            GMBuffer.Seek(this.Offset);
            
            GMBuffer.Seek(this.Base);
        }
    }

    export class Functional {
        Offset: number;
        Count: number;
        First: number;

        constructor(GMBuffer: Buffer) {
            this.Offset = GMBuffer.Read(Type.u32) as number;
            this.Count = GMBuffer.Read(Type.u32) as number;
            this.First = (GMBuffer.Read(Type.u32) as number) + 4;
        }
    }

    export class Runner {
        Buffer: Buffer;
        Chunks: object;
        
        Stack: Array<any> = [];
        Strings: object = {};
        StringList: Array<Stringy> = [];
        Code: object = {};

        constructor(GMBuffer: Buffer, GMChunks: object) {
            this.Buffer = GMBuffer;
            this.Buffer.Seek(0);
            this.Chunks = GMChunks;
            this.Run();
        }

        Functions: object = {
            "show_debug_message": function(str) {
                return console.log(str);
            },
            "show_message": function(str) {
                return window.alert(str);
            },
            "show_message_async": function(str) {
                return console.log(str);
            },
            "show_question": function(str) {
                return window.confirm(str);
            },
            "get_string": function(str, def) {
                return window.prompt(str, def);
            },
            "irandom": function(x) {
                return Math.floor(Math.random() * (x + 1));
            },
            "string": function(val) {
                return val.toString();
            },
            "real": function(val) {
                return (typeof val == "string") ? parseFloat(val) : val;
            }
        }

        GetArguments(GMCount: number) {
            let _Return = [];
            for(let i = 0; i < GMCount; i++) {
                _Return.push(this.Stack.pop());
            }
            return _Return;
        }

        GetInstruction(GMInst: number) {
            // JavaScript is really weird with unsigned values.
            return ((GMInst >> 24) >>> 0) & 0xFF;
        }

        GetBytes(GMInst: number, Index: number, Count: number=0xFF) {
            return ((GMInst >> Index) >>> 0) & Count;
        }

        Run():void {
            // STRG
            this.Buffer.Seek(this.Chunks["STRG"].Base);
            for(let i = 0, _i = this.Buffer.Read(Type.u32); i < _i; i++) {
                let GMString = new Stringy(this.Buffer);
                this.Strings[GMString.Position] = GMString;
                this.StringList.push(this.Strings[GMString.Position]);
                this.Buffer.Seek(GMString.Base);
            }

            // GLOB
            this.Buffer.Seek(this.Chunks["GLOB"].Base);
            for(let i = 0, _i = this.Buffer.Read(Type.u32); i < _i; i++) {

            }
            
            // FUNC
            this.Buffer.Seek(this.Chunks["FUNC"].Base);
            for(let i = 0, _i = this.Buffer.Read(Type.u32); i < _i; i++) {
                let GMFunction = new Functional(this.Buffer);
                if (GMFunction.Count > 0) {
                    while (--GMFunction.Count >= 0) {
                        this.Strings[GMFunction.First] = new Stringy(undefined, GMFunction.First, this.Strings[GMFunction.Offset].Value);
                        if (GMFunction.Count > 0) {
                            GMFunction.First += (this.Buffer.Peek(Type.u32, GMFunction.First) as number) & 0xFFFF;
                        }
                    }
                }
            }

            // VARI
            this.Buffer.Seek(this.Chunks["VARI"].Base + 12);
            while (this.Buffer.Position < this.Chunks["VARI"].Base + this.Chunks["VARI"].Length) {
                let GMVariable = new Variable(this.Buffer);
                console.log(GMVariable);
                if (GMVariable.Offset != 0 && GMVariable.Count > 0) {
                    while (--GMVariable.Count >= 0) {
                        this.Strings[GMVariable.First] = new Stringy(undefined, GMVariable.First, this.Strings[GMVariable.Offset].Value);
                        if (GMVariable.Count > 0) {
                            GMVariable.First += (this.Buffer.Peek(Type.u32, GMVariable.First) as number) & 0xFFFF;
                        }
                    }
                }
            }

            // CODE
            this.Buffer.Seek(this.Chunks["CODE"].Base);
            for(let i = 0, _i = this.Buffer.Read(Type.u32); i < _i; i++) {
                let GMCode = new Code(this.Buffer, this.Strings);
                this.Code[GMCode.Name] = GMCode;
                this.Buffer.Seek(GMCode.Base);
            }
            
            this.Buffer.Seek(this.Chunks["SCPT"].Base);
            for(let i = 0, _i = this.Buffer.Read(Type.u32); i < _i; i++) {
                let GMScript = new Script(this.Buffer);
            }
            // Debug
            console.log(this.Strings);
            //this.Call(this.Code["gml_Room_room0_Create"]);
        }

        Call(GMCode: Code) {
            let GMBuffer = GMCode.Bytecode, GMVariables:object = {}
            GMBuffer.Seek(0);

            let aaa = new Date();

            while (GMBuffer.Position < GMBuffer.Size) {
                let GMInstruction = GMBuffer.Read(Type.u32) as number;

                console.log(`Instruction: ${VMInstruction[this.GetInstruction(GMInstruction)]}, Value=${(GMInstruction).toString(16)}, Position=${GMCode.Position + GMBuffer.Position}`);
                
                switch (this.GetInstruction(GMInstruction)) {
                    case VMInstruction.SET: {
                        let GMRight = this.Stack.pop(), GMLeft = this.Stack.pop();
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
                        GMBuffer.Seek(((GMInstruction & 0xFFF) - 1) * 4, Base.Current);
                        break;
                    }

                    case VMInstruction.BTRUE: {
                        if (this.Stack.pop() == true) {
                            GMBuffer.Seek(((GMInstruction & 0xFFF) - 1) * 4, Base.Current);
                        }
                        break;
                    }

                    case VMInstruction.BFALSE: {
                        if (this.Stack.pop() == false) {
                            GMBuffer.Seek(((GMInstruction & 0xFFF) - 1) * 4, Base.Current);
                        }
                        break;
                    }

                    case VMInstruction.CALL: {
                        console.log(`Call: ${this.Strings[GMCode.Base + GMBuffer.Position].Value}`);
                        this.Stack.push(this.Functions[this.Strings[GMCode.Base + GMBuffer.Position].Value](...this.GetArguments(GMInstruction & 0xFFFF)));
                        GMBuffer.Seek(4, Base.Current);
                        break;
                    }

                    case VMInstruction.PUSH: {
                        switch (this.GetBytes(GMInstruction, 16, 0xFF)) {
                            case VMType.Variable: {
                                /** Variable **/
                                this.Stack.push(GMVariables[this.Strings[GMCode.Position + GMBuffer.Position].Value]);
                                GMBuffer.Seek(4, Base.Current);
                                break;
                            }

                            case VMType.String: {
                                /** String **/
                                this.Stack.push(this.StringList[GMBuffer.Read(Type.u32)].Value);
                                break;
                            }

                            default: {
                                /** Unknown **/
                                console.log(`Unhandled Type: ${VMType[this.GetBytes(GMInstruction, 16, 0xFF)]}`);
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
                        GMBuffer.Seek(4, Base.Current);
                        break;
                    }

                    case VMInstruction.POP: {
                        GMVariables[this.Strings[GMCode.Position + GMBuffer.Position].Value] = this.Stack.pop();
                        console.log(VMScope[(GMInstruction & 0xFFFF) - 65536]);
                        GMBuffer.Seek(4, Base.Current);
                        break;
                    }

                    case VMInstruction.POPNULL: {
                        this.Stack.pop();
                        break;
                    }

                    case VMInstruction.ADD: {
                        let GMValue = this.Stack.pop();
                        this.Stack.push(this.Stack.pop() + GMValue);
                        break;
                    }

                    case VMInstruction.SUB: {
                        let GMValue = this.Stack.pop();
                        this.Stack.push(GMValue - this.Stack.pop());
                        break;
                    }

                    case VMInstruction.DIV: {
                        let GMValue = this.Stack.pop();
                        this.Stack.push(GMValue / this.Stack.pop());
                        break;
                    }

                    case VMInstruction.MUL: {
                        let GMValue = this.Stack.pop();
                        this.Stack.push(GMValue * this.Stack.pop());
                        break;
                    }

                    case VMInstruction.MOD: {
                        let GMValue = this.Stack.pop();
                        this.Stack.push(GMValue % this.Stack.pop());
                        break;
                    }

                    case VMInstruction.REM: {
                        let GMValue = this.Stack.pop();
                        this.Stack.push(GMValue % this.Stack.pop());
                        break;
                    }

                    case VMInstruction.SHL: {
                        let GMValue = this.Stack.pop();
                        this.Stack.push(GMValue << this.Stack.pop());
                        break;
                    }

                    case VMInstruction.SHR: {
                        let GMValue = this.Stack.pop();
                        this.Stack.push(GMValue >> this.Stack.pop());
                        break;
                    }

                    case VMInstruction.XOR: {
                        let GMValue = this.Stack.pop();
                        this.Stack.push(GMValue ^ this.Stack.pop());
                        break;
                    }

                    case VMInstruction.NOT: {
                        this.Stack.push(~this.Stack.pop());
                        break;
                    }

                    case VMInstruction.AND: {
                        let GMValue = this.Stack.pop();
                        this.Stack.push(GMValue & this.Stack.pop());
                        break;
                    }

                    case VMInstruction.OR: {
                        let GMValue = this.Stack.pop();
                        this.Stack.push(GMValue | this.Stack.pop());
                        break;
                    }
                }

            }
            console.log("Variables:", GMVariables);
            console.log("Time Elapsed:", (new Date()).getTime() - aaa.getTime());
        }
    }
}

class Main {
    public static main() {
        new GM.Reader((document.getElementById("input") as HTMLInputElement).files[0]);
    }
}