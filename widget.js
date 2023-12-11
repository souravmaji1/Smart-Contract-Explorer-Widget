// widget.js

class ContractExplorerWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contractAddress: '',
            contractABI: null,
            selectedFunction: null,
            functionInputs: [],
            functionResult: null,
        };
    }

    fetchContractABI = async () => {
        try {
            const response = await axios.get(`https://smartcontractx.onrender.com/contract-info/${this.state.contractAddress}`);
            this.setState({ contractABI: response.data.contractABI });
        } catch (error) {
            console.error('Error fetching contract ABI:', error);
        }
    };

    handleFunctionSelect = (functionName) => {
        const selectedFunc = this.state.contractABI.find((func) => func.name === functionName);
        this.setState({
            selectedFunction: selectedFunc,
            functionInputs: Array(selectedFunc.inputs.length).fill(''),
            functionResult: null,
        });
    };

    handleInputChange = (index, value) => {
        const updatedInputs = [...this.state.functionInputs];
        updatedInputs[index] = value;
        this.setState({ functionInputs: updatedInputs });
    };

    handleTestFunction = async () => {
        try {
            if (!this.state.selectedFunction) {
                console.error('No function selected.');
                return;
            }

            const response = await axios.post(`https://smartcontractx.onrender.com/test-contract/${this.state.contractAddress}`, {
                functionName: this.state.selectedFunction.name,
                inputValues: this.state.functionInputs,
            });

            this.setState({ functionResult: response.data.result });
        } catch (error) {
            console.error('Error testing contract function:', error);
        }
    };

    render() {
        const { contractAddress, contractABI, selectedFunction, functionInputs, functionResult } = this.state;

        const readFunctions = contractABI ? contractABI.filter((item) => item.stateMutability === 'view') : [];
        const writeFunctions = contractABI ? contractABI.filter((item) => item.stateMutability !== 'view') : [];

        return (
            <div className="flex flex-col items-center justify-center px-20 mt-40 w-full z-[20]">
                <div
                    style={{
                        padding: '2rem',
                        maxWidth: '66rem',
                        margin: 'auto',
                        border: '2px solid #7042f88b',
                        borderRadius: '8px',
                        width: '-webkit-fill-available',
                        background: 'linear-gradient(45deg, #2a0e61, #010108)',
                    }}
                >
                    <h1 style={{ color: 'white', marginBottom: '1rem', textAlign: 'center', fontSize: '30px', fontWeight: '700', fontFamily: 'sans-serif' }}>Contract Explorer</h1>
                    <label style={{ color: 'white' }}>
                        Contract Address:
                        <input
                            style={{
                                color: 'black',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                marginBottom: '20px',
                                width: '100%',
                            }}
                            type="text"
                            value={contractAddress}
                            onChange={(e) => this.setState({ contractAddress: e.target.value })}
                        />
                    </label>

                    <button
                        onClick={this.fetchContractABI}
                        style={{
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            background: '#4109af',
                            cursor: 'pointer',
                            border: 'none',
                            display: 'flex',
                            margin: 'auto',
                            outline: 'none',
                        }}
                    >
                        Fetch Contract
                    </button>

                    {contractABI && (
                        <div style={{ display: 'flex', marginTop: '1rem' }}>
                            <div style={{ flex: 1, marginRight: '1rem' }}>
                                <h2 style={{ color: 'white' }}>Read Functions:</h2>
                                <table style={{ width: '100%', border: '1px solid white', color: 'white' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ border: '1px solid white' }}>Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {readFunctions.map((func, index) => (
                                            <tr key={index} style={{ border: '1px solid white' }}>
                                                <td
                                                    onClick={() => this.handleFunctionSelect(func.name)}
                                                    style={{ cursor: 'pointer', border: '1px solid white' }}
                                                >
                                                    {func.name}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div style={{ flex: 1 }}>
                                <h2 style={{ color: 'white' }}>Write Functions:</h2>
                                <table style={{ width: '100%', border: '1px solid white', color: 'white' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ border: '1px solid white' }}>Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {writeFunctions.map((func, index) => (
                                            <tr key={index} style={{ border: '1px solid white' }}>
                                                <td
                                                    onClick={() => this.handleFunctionSelect(func.name)}
                                                    style={{ cursor: 'pointer', border: '1px solid white' }}
                                                >
                                                    {func.name}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {selectedFunction && (
                        <div style={{ marginTop: '20px', border: '1px solid #7042f88b', borderRadius: '8px', padding: '20px', background: '#151515' }}>
                            <h2 style={{ color: '#ffffff', marginBottom: '15px' }}>Selected Function: {selectedFunction.name}</h2>

                            {selectedFunction.inputs.map((input, index) => (
                                <div key={index} style={{ marginBottom: '15px' }}>
                                    <label style={{ color: '#ffffff', display: 'block', marginBottom: '5px' }}>
                                        {input.name} ({input.type}):
                                    </label>
                                    <input
                                        type="text"
                                        value={functionInputs[index]}
                                        onChange={(e) => this.handleInputChange(index, e.target.value)}
                                        style={{
                                            width: '100%',
                                            background: '#282c34',
                                            border: '2px solid #777',
                                            color: '#ffffff',
                                            borderRadius: '4px',
                                            padding: '8px',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>
                            ))}

                            <button
                                onClick={this.handleTestFunction}
                                style={{
                                    color: '#ffffff',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    background: '#4109af',
                                    cursor: 'pointer',
                                    border: 'none',
                                    outline: 'none',
                                }}
                            >
                                Test Function
                            </button>

                            {functionResult && (
                                <div style={{ marginTop: '20px' }}>
                                    <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>Function Result:</h3>
                                    <pre style={{ color: '#ffffff', background: '#282c34', padding: '15px', borderRadius: '8px', overflowX: 'auto' }}>
                                        {JSON.stringify(functionResult, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

ReactDOM.render(<ContractExplorerWidget />, document.getElementById('contract-explorer-widget'));
