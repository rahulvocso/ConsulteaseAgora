import {
  IonPage,
  IonSearchbar,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonTitle,
  IonChip,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  useIonViewWillEnter,
  IonCardTitle,
  IonHeader,
  IonIcon,
  IonCardSubtitle,
  IonAvatar,
  IonText,
} from '@ionic/react';
import {
  arrowRedo,
  arrowUndo,
  arrowUndoCircle,
  body,
  locateOutline,
  reload,
  reloadCircleOutline,
  reloadOutline,
  reloadSharp,
  search,
  starOutline,
  timeOutline,
} from 'ionicons/icons';

// // Swiper slides start
// import "swiper/swiper.min.css";
// import "swiper/modules/navigation/navigation.min.css";
// //import "swiper/modules/autoplay/autoplay.min.css";
// import "swiper/modules/keyboard/keyboard.min.css";
// import "swiper/modules/pagination/pagination.min.css";
// import "swiper/modules/scrollbar/scrollbar.min.css";
// import "swiper/modules/zoom/zoom.min.css";
// import "@ionic/react/css/ionic-swiper.css";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { useSwiper } from "swiper/react";
// import SwiperCore, {
//   Autoplay,
//   Keyboard,
//   Pagination,
//   Navigation,
//   Scrollbar,
//   Zoom,
//   EffectFade,
// } from "swiper";
// //Swiper slides end

import {React, useEffect, useState, useRef} from 'react';
import {useParams, useHistory} from 'react-router';

import {ProCard} from './ProCard';
import useFetch from '../hooks/useFetch';
import './HomeSearchResults.css';
import recentSearch from '../theme/assets/recentSearch.svg';
//import UpLeftSearchArrow from "../theme/assets/UpLeftSearchArrow.png";
import UpLeftSearchArrow from '../theme/assets/UpLeftSearchArrow.svg';
import Avatar from 'react-avatar';

const HomeSearchResults = () => {
  //SwiperCore.use([Autoplay, Pagination, Navigation]);

  const [profiles, setProfiles] = useState([]);
  const [query, setQuery] = useState('');
  const [infiniteDisabled, setInfiniteDisabled] = useState(false);

  const searchBarRef = useRef();
  const removeRecentCardSearchRef = useRef();
  const history = useHistory();
  const homeSearchModalRef = useRef(null);
  const [recentSearches, setRecentSearches] = useState([]);
  //const [isInfiniteDisabled, setIsInfiniteDisabled] = useState(false);

  const [page, setPage] = useState({pageNumber: 0});
  const auth_token = localStorage.getItem('auth_token');
  const {get, loading} = useFetch('https://callingserver.onrender.com/api/v1/');

  const getData = () => {
    // pageNumber=${
    //   parseInt(page.pageNumber) + 1
    // }

    get(
      `user/list?&
      pageNumber=${parseInt(page.pageNumber) + 1}
      &sort=stats.rating_average&sort_type=1&keyword=${query}`,
      {
        auth_token: auth_token,
      },
    ).then(data => {
      console.log('hello');
      console.log(data.status, 'data', data);
      // profiles
      //   ? setProfiles(() => [...data.body.data]): //...profiles
      setProfiles(() => [...data.body.data]);
      setPage({
        pageNumber: data.body.pageNumber + 1,
        pageCount: data.body.pageCount,
        recordCount: data.body.recordCount,
      });
      console.log(profiles, 'get request for profiles completed');
    });
  };

  const loadData = ev => {
    if (page.pageNumber === page.pageCount) {
      setInfiniteDisabled(() => true);
    }

    get(
      `user/list?&
      pageNumber=${parseInt(page.pageNumber) + 1}
      &sort=stats.rating_average&sort_type=1&keyword=${query}`,
      {
        auth_token: auth_token,
      },
    ).then(data => {
      console.log('hello');
      console.log(data.status, 'data', data);
      setProfiles(() => [...profiles, ...data.body.data]);
      setPage(() => ({
        pageNumber: data.body.pageNumber + 1,
        pageCount: data.body.pageCount,
        recordCount: data.body.recordCount,
      }));
    });

    infiniteDisabled && console.log('infinite disabled', infiniteDisabled);
    console.log(page.pageNumber, 'page.Pagenumber');
    ev.target.complete();
  };

  const handleSearchQuery = e => {
    setQuery(() => e.target.value);
    getData();
    //console.log("*****handleSearchQuery", e.detail.value, " query ", profiles);
  };

  function getLocalStorageRecentSearches() {
    let local =
      localStorage.getItem('localRecentSearches') !== (undefined || null) &&
      localStorage.getItem('localRecentSearches').length !== 0
        ? JSON.parse(localStorage.getItem('localRecentSearches'))
        : [];
    //console.log(localStorage.getItem("localRecentSearches"));
    setRecentSearches(() => local);
    return recentSearches;
  }

  function setLocalStorageRecentSearches(e) {
    recentSearches.length >= 5 && recentSearches.pop();
    query && recentSearches.unshift(query);
    localStorage.setItem('localRecentSearches', JSON.stringify(recentSearches));
    // test... localStorage.setItem("localRecentSearches", "");
    console.log('setLocal', recentSearches);
  }

  // useIonViewWillEnter(() => {
  //   getData();
  // });

  // let trendingSwiper = new SwiperCore(".trendingSearchProfiles", {
  //   autoplay: 500,
  // });

  useIonViewWillEnter(() => {
    getLocalStorageRecentSearches();
  });

  useEffect(() => {
    //history.push(`search?query=${query}`);
    getData();
  }, []);

  return (
    <IonPage ref={homeSearchModalRef}>
      <IonHeader>
        <IonSearchbar
          ref={searchBarRef}
          showClearButton="focus"
          showCancelButton="always"
          animated={true}
          //debounce={500}
          //value={query}
          input={query}
          placeholder="Search people to talk to..."
          onIonClear={e => setQuery(e => '')}
          onIonCancel={e => {
            if (e.target.value) setLocalStorageRecentSearches(e);
            history.push(`/home`);
          }}
          onIonChange={e => {
            e.target.value.length > 1 && handleSearchQuery(e);
          }}
          //options={{ passive: true }}
        ></IonSearchbar>
      </IonHeader>

      <IonContent className="searchPageContainer">
        {query === '' && (
          <div>
            <div className="recentSearchesContainer">
              <IonCardTitle className="recentSearchesContainer-Title">
                Recent Searches
              </IonCardTitle>
              <div className="recentSearch-Item-Holder">
                {recentSearches.length !== 0 ?
                  recentSearches.map((recentSearchItem, index) => {
                    return (
                      <div
                        tappable="true"
                        key={`${recentSearchItem}${index}`}
                        value={recentSearchItem}
                        onClick={e => {
                          console.log(typeof recentSearchItem, e.target.value);
                          setQuery(() => recentSearchItem);
                          searchBarRef.current.value = recentSearchItem;
                        }}>
                        <IonGrid>
                          <IonChip className="recentSearch-Item">
                            <div>
                              <IonIcon
                                icon={recentSearch}
                                color="medium"
                                className="item1"
                              />
                              <IonCardSubtitle className="item2">
                                {recentSearchItem}
                              </IonCardSubtitle>
                            </div>
                            <div>
                              <IonIcon
                                icon={UpLeftSearchArrow}
                                color="medium"
                                className="item3"
                              />
                            </div>
                          </IonChip>
                        </IonGrid>
                      </div>
                    );
                  })
                :
                <div className="searchedProfile-TextDetail">
                  <p>no recent searches</p>
                </div>
                } 
              </div>
            </div>

            <div className="trendingProfilesContainer">
              <IonCardTitle className="recentSearchesCard-Title">
                Trending Profiles
              </IonCardTitle>
              {profiles &&
                profiles.map((profile, _id) => (
                  <div
                    key={_id}
                    className="trendingProfile"
                    onClick={() => {
                      history.push('/profile/' + profile._id);
                      setInfiniteDisabled(false);
                    }}>
                    <div className="trendingProfileAvatar">
                      <Avatar
                        size="50"
                        round="50%"
                        name={profile.fname}
                        src={
                          profile.profile.photo
                            ? profile.profile.photo
                            : profile.photo
                        }
                      />
                    </div>
                    <div className="trendingProfile-TextDetail">
                      <h5>
                        {profile.fname} {profile.lname}
                      </h5>
                      <p>{profile.profile.title}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {query !== '' && (
          <IonGrid className="searchResults-Container">
            <IonRow>
              <IonCol>
                <IonTitle className="searchResults-Heading">
                  Search Results
                </IonTitle>
                <div>
                  {profiles &&
                    profiles
                      .filter((profile) => {
                        if (
                          (profile.profile.handle &&
                            profile.profile.handle
                              .toString()
                              .toLowerCase()
                              .includes(query.toLowerCase())) ||
                          (profile.fname &&
                            profile.fname
                              .toString()
                              .toLowerCase()
                              .includes(query.toLowerCase())) ||
                          (profile.lname &&
                            profile.lname
                              .toString()
                              .toLowerCase()
                              .includes(query.toLowerCase()))
                        )
                        return profile;
                      })
                      .map((profile, _id) => (
                        <div
                          key={`${_id}" "${profile}`}
                          className="searchedProfile"
                          onClick={() => {
                            history.push('/profile/' + profile._id);
                            setInfiniteDisabled(false);
                          }}>
                          <div className="searchedProfileAvatar">
                            <Avatar
                              size="50"
                              round="50%"
                              name={profile.fname}
                              src={
                                profile.profile.photo
                                  ? profile.profile.photo
                                  : profile.photo
                              }
                            />
                          </div>
                          <div className="searchedProfile-TextDetail">
                            <h5>
                              {profile.fname} {profile.lname}
                            </h5>
                            <p>{profile.profile.title}</p>
                          </div>
                        </div>
                      ))}

                  <IonInfiniteScroll
                    onIonInfinite={ev => {
                      loadData(ev);
                    }}
                    threshold="100px"
                    disabled={infiniteDisabled}>
                    <IonInfiniteScrollContent
                      loadingSpinner="bubbles"
                      loadingText="Loading more profiles..."></IonInfiniteScrollContent>
                  </IonInfiniteScroll>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
};

export default HomeSearchResults;

{
  /* <Swiper
  modules={[
    Autoplay,
    EffectFade,
    Keyboard,
    Pagination,
    Scrollbar,
    Zoom,
    Navigation,
  ]}
  autoplay={{
    delay: 2000,
    disableOnInteraction: false,
  }}
  keyboard={true}
  pagination
  zoom={true}
  loop={true}
  //navigation={true}
  speed={800}
>
  {profiles &&
    profiles.map((prof, _id) => {
      return (
        <SwiperSlide key={_id} className="">
          <ProCard
            key={_id}
            profile={prof}
            //pageRef={pageRef}
            setInfiniteDisabled={setInfiniteDisabled}
            onClick={() => {
              setLocalStorageRecentSearches();
              homeSearchModalRef.current.dismiss();
            }}
          />
        </SwiperSlide>
      );
    })}
  <SwiperSlide className="">
    <div>
      <p>PlaceHolder trending profile slide</p>
      <p>will be removed</p>
    </div>
  </SwiperSlide>
</Swiper>; */
}
