import React from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { Result, Button } from 'antd';
import auth from '../../../../apis/auth';
import GeneralAuthModal from '../GeneralAuthModal';
import RedirectCountdown from '../../../../components/RedirectCountdown';
import FIELDS from './Fields';
import ROUTES from '../../Routes';

const REDIRECT_AFTER_SECONDS = 3;

class ResetPasswordModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectCountdown: REDIRECT_AFTER_SECONDS,
    }

    this.countdown = this.countdown.bind(this);
  }

  componentDidMount() {
    this.countdown();
  }

  countdown() {
    if(this.state.redirectCountdown > 0 ) {
      clearTimeout(this.redirectTimer);
      this.redirectTimer = setTimeout(() => {
        this.subtractRedirectCountdown();
        this.countdown();
      }, 1000);
    }
  }

  subtractRedirectCountdown() {
    this.setState((prevState) => {
      return { redirectCountdown: prevState.redirectCountdown - 1 };
    });
  }

  render() {
    const { history } = this.props;
    const { redirectCountdown } = this.state;
    const request = history.location.search;
    const token = request.replace('?token=', '');

    return (
      // <GeneralAuthModal
      //   title="Reset Password"
      //   FIELDS={FIELDS}
      //   api={auth.resetPassword}
      //   token={token}
      //   submitButtonText="Reset Password"
      //   AfterSubmission={<Result
      //     status="success"
      //     title="Successfully reset password"
      //     subTitle="Redirecting to log in..."
      //   />}
      // />
      <Result
        status="success"
        title="Successfully reset password"
        subTitle="Redirecting to log in..."
        extra={
          <Button>
            <Link to={ROUTES.signIn.path}>
            <RedirectCountdown seconds={REDIRECT_AFTER_SECONDS} to={ROUTES.signIn.path} />
            </Link>
          </Button>
        }
      />

    ); 
  }
}

const ResetPasswordModalWithRoute = withRouter(ResetPasswordModal)

export default ResetPasswordModalWithRoute;