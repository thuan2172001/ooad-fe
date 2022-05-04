import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { connect, RootStateOrAny, useSelector } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import * as auth from '../_redux/auth-redux';
import { GetCredential, Ping } from '../_redux/auth.service';
import { GenerateCertificate, SymmetricDecrypt, } from '../service/auth-cryptography';
import { CERTIFICATE_EXP } from '../../../common-library/common-consts/enviroment';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import clsx from 'clsx';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {
  createStyles,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  makeStyles,
  OutlinedInput,
  Theme
} from "@material-ui/core";

const initialValues = {
  password: '',
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: theme.spacing(1),
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      width: '25ch',
    },
  }),
);

interface State {
  amount: string;
  password: string;
  weight: string;
  weightRange: string;
  showPassword: boolean;
}

const LoginPassword = (props: {
  location?: any;
  saveUserInfo?: any;
  savePingErrorData?: any;
  intl?: any;
}) => {
  const { intl } = props;
  const userInfo = useSelector(({ auth }: { auth: RootStateOrAny }) => auth);
  const [loading, setLoading] = useState(false);

  const location = window.location;
  const { pathname } = location;
  const { search } = location;
  let callbackUrl = new URLSearchParams(search).get('callbackUrl');
  callbackUrl = callbackUrl ? callbackUrl : pathname;

  const classes = useStyles();
  const [values, setValues] = useState<State>({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });

  const LoginSchema = Yup.object().shape({
    // password: Yup.string()
    //   .min(3, 'Minimum 3 symbols')
    //   .max(50, 'Maximum 50 symbols')
    //   .required(
    //     intl.formatMessage({
    //       id: 'AUTH.VALIDATION.REQUIRED_FIELD',
    //     }),
    //   ),
  });

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  const submitPassword = (
    { password }: { password: string },
    { setStatus, setSubmitting }: { setStatus: any; setSubmitting: any },
  ) => {
    setLoading(true);
    setTimeout(() => {
      GetCredential(userInfo.username)
        .then(response => {
          const { encryptedPrivateKey, publicKey } = response.data;
          const _privateKey = SymmetricDecrypt(encryptedPrivateKey, values.password);
          const certificate = GenerateCertificate(
            {
              id: userInfo.id,
              timestamp: new Date().getTime(),
              exp: CERTIFICATE_EXP,
            },
            _privateKey,
          );
          props.saveUserInfo({
            ...response.data,
            _certificate: certificate,
            _preLoggedIn: true,
            _privateKey,
          });
          Ping()
            .then((res: { data: any; }) => {
              props.saveUserInfo({
                ...res.data,
                _certificate: certificate,
                _privateKey,
                _preLoggedIn: false,
              });
            })
            .catch((err: any) => {
              setLoading(false);
              setSubmitting(false);
              console.log({ err })
              props.savePingErrorData(err);
            });
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
          setSubmitting(false);
          setStatus(
            intl.formatMessage({
              id: 'AUTH.VALIDATION.INVALID_PASSWORD',
            }),
          );
        });
    }, 200);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: submitPassword,
  });

  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <div
      className="login-form login-signin p-5"
      id="kt_login_signin_form"
      style={{ zIndex: 1 }}
    >
      {/* begin::Head */}
      <div className="text-center mb-10 mb-lg-10">
        <div className="mx-auto text-center w-50">
          <h6
            className="font-weight-bold mt-5 pt-3 pb-3 border rounded-pill"
            style={{ border: '1px solid #dadce0', color: '#3c4043' }}>
            <AccountCircleIcon />
            {'\u00A0'}
            {userInfo.fullName}
          </h6>
        </div>
      </div>
      {/* end::Head */}
      {/* {userInfo._error &&} */}
      {/*begin::Form*/}
      <form
        onSubmit={formik.handleSubmit}
        className="form fv-plugins-bootstrap fv-plugins-framework">
        <div className="form-group fv-plugins-icon-container">
          <FormControl
            className={clsx(classes.margin, classes.textField) + ' w-100'}
            variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              <FormattedMessage id="AUTH.LOGIN.PASSWORD" />
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={values.showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={handleChange('password')}
              autoFocus
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end">
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={55}
            />
          </FormControl>
          {formik.touched.password && formik.errors.password ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.password}</div>
            </div>
          ) : null}
          {formik.status ? (
            <span className="text-danger font-weight-bold ml-3">{formik.status}</span>
          ) : (
            userInfo._error && (
              <span className="text-danger font-weight-bold ml-3">{userInfo._error}</span>
            )
          )}
        </div>

        <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
          <Link
            style={{ zIndex: 1 }}
            to={'/auth/forgot-password?callbackUrl=' + callbackUrl}
            className="text-hover-primary my-3 ml-3"
            id="kt_login_forgot">
            <p className="text-dark-50 font-weight-bold">
              <FormattedMessage id="AUTH.GENERAL.FORGOT_BUTTON" />
            </p>
          </Link>
          <button
            id="kt_login_signin_submit"
            type="submit"
            disabled={formik.isSubmitting}
            style={{ zIndex: 1 }}
            className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}>
            <span><FormattedMessage id="AUTH.LOGIN.LOGIN_BTN" /></span>
            {loading && <span className="ml-3 spinner spinner-white" />}
          </button>
        </div>
      </form>
      {/*end::Form*/}
    </div>
  );
};

export default injectIntl(connect(null, auth.actions)(LoginPassword));
