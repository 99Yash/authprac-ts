import React from 'react';
import { firebaseConfig } from '../services/firebase';

const AuthForm = () => {
  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const passwordInputRef = React.useRef<HTMLInputElement>(null);

  const [isLogin, setIsLogin] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current!.value;
    const enteredPassword = passwordInputRef.current!.value;

    //    Add validation
    setIsLoading(true);
    let url = '';
    if (isLogin) {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`;

      //Do login stuff
    } else {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`;
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.ok) {
          // Do something
          return res.json();
        } else {
          return res.json().then((data) => {
            // Show an error modal
            let errorMessage = 'Authentication failed!';
            // if (data && data.error && data.error.message) {
            // errorMessage = data.error?.message;
            // }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <section>
      <h1>{isLogin ? 'Login' : 'Sign up'}</h1>
      <form onSubmit={submitHandler}>
        <div className="">
          <label htmlFor="email">Enter your email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className="">
          <label htmlFor="password">Enter password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
        {isLoading && <p>Sending request...</p>}
        <button onClick={switchAuthModeHandler}>
          {isLogin ? 'Create new account' : 'Login with existing account'}
        </button>
      </form>
    </section>
  );
};

export default AuthForm;
