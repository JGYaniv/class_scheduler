import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import { FormattedMessage } from 'react-intl';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import EditIcon from 'material-ui/svg-icons/image/edit';
import METHODS from './utils/RestConstants';

import { postData } from './utils/sendData';
import AvailabilitiesTable from './AvailabilitiesTable';
import Header from './reusable/Header';
import CommentContainer from './CommentContainer';

import ReviewContainer from './ReviewContainer';
import Footer from './reusable/Footer';
import FormData from './utils/FormData';
import SnackBarComponent from './reusable/SnackBarComponent';

import './UserProfile.css';

class UserProfile extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleReviewSubmit = this.handleReviewSubmit.bind(this);
    this.updateStars = this.updateStars.bind(this);
    this.handleViewProfileClick = this.handleViewProfileClick.bind(this);

    const { review : { review, id } } = props;

    this.state = {
      stars: review,
      showSnackBar: false,
      message: '',
      id: id
    };
  }


  componentWillUpdate({ review: { review, id } }) {
    const { review:  { review: currentReview, id: currentId } } = this.props;

    if (currentReview !== review || currentId !== id) {
      this.updateStars(review, id);
    }
  }

  updateStars(review, id) {
    this.setState({
      stars: review,
      id: id
    });
  }

  render() {
    const { currentUser } = this.props;

    return (
      <div>
        <Header currentUser={ currentUser } />
        <Paper zDepth={ 1 } className='paperOverride' rounded={ false }>
          { this.renderContent() }
        </Paper>
        { this.renderSnackBar() }
        <Footer />
      </div>
    );

  }

  renderContent() {
    const { user } = this.props;

    if (!user.url_slug) {
      return (
        <div>
          { this.renderBackButton() }
          <div className='userProfileRefreshIndicator'>
            <RefreshIndicator
              size={ 50 }
              top={ 0 }
              left={ 0 }
              loadingColor="#FF9800"
              status='loading'
            />
          </div>
        </div>
      );
    } else {
      const { user, user: { url_slug, first_name, ten_last_comments, programs }, review } = this.props;

      return (
        <div>
          { this.renderBackButton() }
          { this.renderProfilePicture() }

          <div className='userProfileButtonAndDetailsContainer'>
            <Link to={ { pathname: '/messages/new', query: { recipient: url_slug, userName: first_name } } } className='userProfileLink' >
              <RaisedButton
                className='userProfileMessageButton'
                label={
                  <FormattedMessage
                    id='UserProfile.messageUser'
                    defaultMessage='Message User'
                  />
                }
                primary
              />
            </Link>

            <div className='userProfileReviewAndComment' >
              <ReviewContainer review={ review } onClick={ this.handleReviewSubmit } />
            </div>

            <div className='userProfileDetailsContainer'>
              <div className='userProfileLeftDetails'>
                <div className='userProfileField'>
                  <FormattedMessage
                    id='UserProfile.firstName'
                    defaultMessage='First Name:'
                  />
                  <span> { first_name }</span>
                </div>

                { this.renderLocation() }

                <div className='userProfileField'>
                  <FormattedMessage
                    id='UserProfile.programsOffered'
                    defaultMessage='Programs:'
                  /> { programs? programs.join(', ') : '' }
                </div>

                <div className='userProfileField'>
                  <FormattedMessage
                    id='UserProfile.lastLogIn'
                    defaultMessage='Last logged in:'
                  />
                  <span> { user.last_logged_in} <FormattedMessage
                    id='ago'
                    defaultMessage='ago'
                  />
                </span>
                </div>

                <div className='userProfileField'>
                  <FormattedMessage
                    id='UserProfile.moreInformation'
                    defaultMessage='A bit more information:'
                  />
                  <span> { this.renderUserDescription() } </span>
                </div>
              </div>

              <div className='userProfileCommentContainer'>
                <CommentContainer userId={ url_slug } comments={ ten_last_comments } />
              </div>
            </div>

            { this.renderAvailabilities() }

            <Link className='userProfileSendEmail' to={ { pathname: '/messages/new', query: { recipient: url_slug, userName: first_name } } } >
              <FloatingActionButton>
                <EditIcon />
              </FloatingActionButton>
            </Link>
          </div>
        </div>
      );
    }
  }

  renderBackButton() {
    const { location: { state } } = this.props;

    if (state && state.search) {
      return (
        <div className='userProfileBackButton'>
          <FlatButton
            primary
            label={
              <FormattedMessage
                id='UserProfile.Back'
                defaultMessage='Back to search results'
              />
            }
            onClick={ this.handleViewProfileClick }
          />
        </div>
      );
    }
  }

  handleViewProfileClick() {
    const { history } = this.props;

    const { location: { state } } = this.props;

    if (state && state.search) {
      const { search, volunteers } = state;

      history.replace('/volunteers', { ...{ search }, volunteers });
    }
  }

  renderLocation() {
    const { currentUser: { city } } = this.props;

    if (city) {
      return (
        <div className='userProfileField'>
          <FormattedMessage
            id='UserProfile.location'
            defaultMessage='Location:'
          />
          <span> { this.renderUserLocation() }</span>
        </div>
      );
    }
  }

  renderUserLocation() {
    const { user: { city, country, state } } = this.props;

    if (city || country || state) {
      return _.compact([ city, state, country ]).join(', ');
    } else {
      return this.renderNotAvailable();
    }
  }

  renderUserDescription() {
    const { user: { description } } = this.props;

    if (description) {
      return description;
    } else {
      return this.renderNotAvailable();
    }
  }

  renderNotAvailable() {
    return(
      <FormattedMessage
        id='UserProfile.NotAvailable'
        defaultMessage='Not available'
      />
    );
  }

  renderProfilePicture() {
    const { user: { thumbnail_image } } = this.props;

    if (!_.isEmpty(thumbnail_image) && !_.endsWith(thumbnail_image, 'missing.png')) {
      return (
        <div className='userProfileImageContainer'  >
          <img src={ thumbnail_image } alt='User Profile' className='userProfileImage' />
        </div>
      );
    }
  }



  renderSnackBar() {
    if (this.state.showSnackBar) {
      return <SnackBarComponent open={ this.state.showSnackBar } message={ this.state.message } />;
    }
  }

  handleGetUserData() {
    const { match: { params: { url_slug } } } = this.props;

    const requestParams = {
      url: `/profiles/${url_slug}`,

      successCallBack: ({ user, currentUser }) => {
        this.setState({
          user,
          currentUser
        });
      },

      errorCallBack: (message) => {
        this.setState({
          message: message,
        });
      }
    };

    return getData(requestParams);
  }

  handleReviewSubmit(value, comment) {
    const { user: { url_slug }, review: { id } } = this.props;

    const attributes = FormData.from({ review: _.toNumber(value), comment, user_id: url_slug, id });
    const method = id || this.state.id ? METHODS.PUT : METHODS.POST;
    const restUrl = id || this.state.id ? `/reviews/${id||this.state.id}` : '/reviews';

    const requestParams = {
      url: restUrl,
      attributes,
      method,
      successCallBack: (response) => {
        const { review: { review, id } } = response;

        this.setState({
          stars: _.toNumber(review),
          id: id
        });
      },

      errorCallBack: (message) => {
        this.setState({
          showSnackBar: true,
          message
        });
        this.resetForm();

        setTimeout(() => {
          this.handleHideSnackBar();
        }, 2000);
      }
    };

    return postData(requestParams);
  }

  renderAvailabilities() {
    const { user: { availabilities, timezone } } = this.props;

    if ( _.size(availabilities) > 0 ) {
      return (
        <AvailabilitiesTable
          availabilities={ availabilities }
          timezone={ timezone }
        />
      );
    }
  }
}

UserProfile.propTypes = {
  review: PropTypes.shape({
    review: PropTypes.number,
    id: PropTypes.any,
    comment: PropTypes.string
  }),
  currentUser: PropTypes.object.isRequired,
  user: PropTypes.shape({
    availabilities: PropTypes.array,
    programs: PropTypes.array,
    first_name: PropTypes.string,
    thumbnail_url: PropTypes.string,
    url_slug: PropTypes.string,
  }),
  history: PropTypes.object,
  location: PropTypes.shape({
    state: PropTypes.shape({
      volunteers: PropTypes.array,
      search: PropTypes.object
    })
  }),
  match: PropTypes.shape({
    params: PropTypes.object
  })
};

UserProfile.defaultProps = {
  user: {
    city: '',
    description: '',
  },
  review: {
    comment: ''
  },
  history: {},
  location: {
    state: {
      search: {}
    }
  },
  match: {
    params: {
    }
  }
};

export default UserProfile;
