import JSCPP from "JSCPP";
const code = `#include <iostream>
using namespace std;
int main() {
    cout << "Hello from JSCPP" << endl;
    return 0;
}`;
const input = "";
let out = "";
const outputObj = {
    write: (s) => process.stdout.write(s)
};
const config = { stdio: outputObj };
JSCPP.run(code, input, config);
