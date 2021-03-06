import * as assert from "assert";
import * as ts from "typescript";

const compilerOptions = {
    strict: true,
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS
};

const sourceFileName = "scratch-module.ts";

const program = ts.createProgram([sourceFileName], compilerOptions);

export const typeChecker = program.getTypeChecker();
{
    const errors = ts.getPreEmitDiagnostics(program);
    if (errors.length) {
        console.error(ts.formatDiagnosticsWithColorAndContext(errors, ts.createCompilerHost(compilerOptions)));
    }
}

const sourceFile = program.getSourceFiles().filter((sourceFile) => sourceFile.fileName == sourceFileName)[0];

const myModule = typeChecker.getSymbolAtLocation(sourceFile);
assert(myModule.name == "\"scratch-module\"");

const syms: ts.Symbol[] = [];
typeChecker.getExportsOfModule(myModule).forEach(exp => {
    if (exp.members) {
        exp.members.forEach((symMember) => { syms.push(symMember); });
    }
    if (exp.exports) {
        exp.exports.forEach((symExport) => { syms.push(symExport); });
    }
});

syms.forEach(sym => {
    const tc = typeChecker, ts0 = ts; // Ensure these are captured in the debugger.
    console.log(sym);
    const decls = sym.getDeclarations();
    console.log(decls);
    const ty = tc.getTypeOfSymbolAtLocation(sym, decls[0]);
    console.log(ty);
    if (sym.getName() == "foo") {
        const signature = tc.getSignatureFromDeclaration(<ts.SignatureDeclaration>decls[0]);
        const param0 = signature.parameters[0];
        const tyParam = tc.getTypeOfSymbolAtLocation(param0, param0.declarations[0]);
        const tyParamSym = tyParam.symbol;
        const tyParamSig = tc.getSignatureFromDeclaration(<ts.SignatureDeclaration>(tyParamSym.declarations[0]));
        console.log(signature);
        console.log(param0);
        console.log(tyParam);
        console.log(tyParamSym);
        console.log(tyParamSig);
    }
});

// Make sure symbols are not garbage collected.
console.log(typeChecker === undefined);
console.log(ts === undefined);
