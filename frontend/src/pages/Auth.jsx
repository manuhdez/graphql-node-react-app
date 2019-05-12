import React, {Component} from 'react';
import AuthContext from '../context/auth-context';

import './Auth.css';

class AuthPage extends Component {
    constructor(props) {
        super(props);
        this.emailRef = React.createRef();
        this.passRef = React.createRef();
        this.state = {
            signupMode: false,
        }
    }

    static contextType = AuthContext;

    switchModeHandler = () => {
        this.setState(prevState => ({ signupMode: !prevState.signupMode }));
    }

    submitHandler = (e) => {
        e.preventDefault();
        const email = this.emailRef.current.value;
        const password = this.passRef.current.value;

        if (!email.trim().length || !password.trim().length) return;

        let requestBody;
        if (this.state.signupMode) {
            requestBody = {
                query: `
                    mutation {
                        createUser(userInput: { email: "${email}", password: "${password}"}) {
                            _id,
                            email
                        }
                    }
                `
            }
        } else {
            requestBody = {
                query: `
                    query {
                        login(email: "${email}", password:"${password}") {
                        userId,
                        token,
                        tokenExp
                        }
                    }
                `
            }
        }

            // Send request to the server
        fetch('http://localhost:5000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error(res.errors);
            }
            return res.json();
        })
        .then(data => {
            const { userId, token, tokenExp } = data.data.login;
            this.context.login(userId, token, tokenExp);
        })
        .catch(error => console.log(error));
    };

    render() {
        return (
            <form className="auth-form" onSubmit={this.submitHandler}>
                <div className="form-control">
                    <label htmlFor="email">E-mail</label>
                    <input type="email" id="email" ref={this.emailRef} />
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" ref={this.passRef} />
                </div>
                <div className="form-actions">
                <button type="submit">Submit</button>
                <button type="button" onClick={this.switchModeHandler}>
                {this.state.signupMode ? 'Login' : 'Signup'}
                </button>
                </div>
            </form>
        );
    }
}

export default AuthPage;