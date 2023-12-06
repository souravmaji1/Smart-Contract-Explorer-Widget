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
            const response = await axios.get(`http://localhost:5000/contract-info/${this.state.contractAddress}`);
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

            const response = await axios.post(`http://localhost:5000/test-contract/${this.state.contractAddress}`, {
                functionName: this.state.selectedFunction.name,
                inputValues: this.state.functionInputs,
            });

            this.setState({ functionResult: response.data.result });
        } catch (error) {
            console.error('Error testing contract function:', error);
        }
    };

    render() {
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
                    <h1 style={{ color: 'white' }}>Contract Explorer</h1>
                    <label style={{ color: 'white' }}>
                        Contract Address:
                        <input
                            style={{ color: 'black' }}
                            type="text"
                            value={this.state.contractAddress}
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
                        }}
                    >
                        Fetch Contract ABI
                    </button>

                    {this.state.contractABI && (
                        <div style={{ display: 'flex', marginTop: '1rem' }}>
                            {/* Events Table */}
                            <div style={{ flex: 1, marginRight: '1rem' }}>
                                <h2 style={{ color: 'white' }}>Events:</h2>
                                <table style={{ width: '100%', border: '1px solid white', color: 'white' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ border: '1px solid white' }}>Name</th>
                                            {/* Add more columns as needed */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.contractABI
                                            .filter((item) => item.type === 'event')
                                            .map((event, index) => (
                                                <tr key={index} style={{ border: '1px solid white' }}>
                                                    <td
                                                        onClick={() => this.handleFunctionSelect(event.name)}
                                                        style={{ cursor: 'pointer', border: '1px solid white' }}
                                                    >
                                                        {event.name}
                                                    </td>
                                                    {/* Add more columns as needed */}
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Functions Table */}
                            <div style={{ flex: 1 }}>
                                <h2 style={{ color: 'white' }}>Functions:</h2>
                                <table style={{ width: '100%', border: '1px solid white', color: 'white' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ border: '1px solid white' }}>Name</th>
                                            {/* Add more columns as needed */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.contractABI
                                            .filter((item) => item.type === 'function')
                                            .map((func, index) => (
                                                <tr key={index} style={{ border: '1px solid white' }}>
                                                    <td
                                                        onClick={() => this.handleFunctionSelect(func.name)}
                                                        style={{ cursor: 'pointer', border: '1px solid white' }}
                                                    >
                                                        {func.name}
                                                    </td>
                                                    {/* Add more columns as needed */}
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {this.state.selectedFunction && (
                        <div>
                            <h2 style={{ color: 'white' }}>Selected Function: {this.state.selectedFunction.name}</h2>
                            {this.state.selectedFunction.inputs.map((input, index) => (
                                <div key={index}>
                                    <label style={{ color: 'white' }}>
                                        {input.name} ({input.type}):
                                        <input
                                            type="text"
                                            value={this.state.functionInputs[index]}
                                            onChange={(e) => this.handleInputChange(index, e.target.value)}
                                            style={{
                                                width: '100%',
                                                background: 'white',
                                                border: '2px solid #ccc',
                                                borderRadius: '4px',
                                                padding: '8px',
                                            }}
                                        />
                                    </label>
                                </div>
                            ))}

                            <button
                                onClick={this.handleTestFunction}
                                style={{
                                    color: 'white',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    background: '#4109af',
                                    cursor: 'pointer',
                                }}
                            >
                                Test Function
                            </button>

                            {this.state.functionResult && (
                                <div>
                                    <h3 style={{ color: 'white' }}>Function Result:</h3>
                                    <pre style={{ color: 'white' }}>{JSON.stringify(this.state.functionResult, null, 2)}</pre>
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
