import { createApi } from "@reduxjs/toolkit/query/react";
import extendedBaseQuery from "../dynamic-base-query";
export const api = createApi({
  baseQuery: extendedBaseQuery,
  keepUnusedDataFor: 0,
  tagTypes: [],
  endpoints: (build) => ({
    getOidcAuthTokenItem: build.query<
      GetOidcAuthTokenItemApiResponse,
      GetOidcAuthTokenItemApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/authentication/oidc/token`,
        params: { state: queryArg.state, code: queryArg.code },
      }),
    }),
    getOidcAuthUrlsItem: build.query<
      GetOidcAuthUrlsItemApiResponse,
      GetOidcAuthUrlsItemApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/authentication/oidc/urls`,
        params: { providerKey: queryArg.providerKey },
      }),
    }),
    postLoginInfoScreen: build.mutation<
      PostLoginInfoScreenApiResponse,
      PostLoginInfoScreenApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/authentication/screen`,
        method: "POST",
        body: queryArg.screenLoginInput,
      }),
    }),
    postRefreshTokenItem: build.mutation<
      PostRefreshTokenItemApiResponse,
      PostRefreshTokenItemApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/authentication/token/refresh`,
        method: "POST",
        body: queryArg.refreshTokenRequest,
      }),
    }),
    getV2FeedSources: build.query<
      GetV2FeedSourcesApiResponse,
      GetV2FeedSourcesApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/feed-sources`,
        params: {
          page: queryArg.page,
          itemsPerPage: queryArg.itemsPerPage,
          supportedFeedOutputType: queryArg.supportedFeedOutputType,
          title: queryArg.title,
          description: queryArg.description,
          createdBy: queryArg.createdBy,
          modifiedBy: queryArg.modifiedBy,
          order: queryArg.order,
        },
      }),
    }),
    postV2FeedSources: build.mutation<
      PostV2FeedSourcesApiResponse,
      PostV2FeedSourcesApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/feed-sources`,
        method: "POST",
        body: queryArg.feedSourceFeedSourceInput,
      }),
    }),
    getV2FeedSourcesById: build.query<
      GetV2FeedSourcesByIdApiResponse,
      GetV2FeedSourcesByIdApiArg
    >({
      query: (queryArg) => ({ url: `/v2/feed-sources/${queryArg.id}` }),
    }),
    putV2FeedSourcesById: build.mutation<
      PutV2FeedSourcesByIdApiResponse,
      PutV2FeedSourcesByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/feed-sources/${queryArg.id}`,
        method: "PUT",
        body: queryArg.feedSourceFeedSourceInput,
      }),
    }),
    deleteV2FeedSourcesById: build.mutation<
      DeleteV2FeedSourcesByIdApiResponse,
      DeleteV2FeedSourcesByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/feed-sources/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
    getV2FeedSourcesByIdSlides: build.query<
      GetV2FeedSourcesByIdSlidesApiResponse,
      GetV2FeedSourcesByIdSlidesApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/feed-sources/${queryArg.id}/slides`,
        params: {
          page: queryArg.page,
          itemsPerPage: queryArg.itemsPerPage,
          title: queryArg.title,
          description: queryArg.description,
          createdBy: queryArg.createdBy,
          modifiedBy: queryArg.modifiedBy,
          published: queryArg.published,
          order: queryArg.order,
        },
      }),
    }),
    getV2FeedSourcesByIdConfigAndName: build.query<
      GetV2FeedSourcesByIdConfigAndNameApiResponse,
      GetV2FeedSourcesByIdConfigAndNameApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/feed_sources/${queryArg.id}/config/${queryArg.name}`,
      }),
    }),
    getV2Feeds: build.query<GetV2FeedsApiResponse, GetV2FeedsApiArg>({
      query: (queryArg) => ({
        url: `/v2/feeds`,
        params: {
          page: queryArg.page,
          itemsPerPage: queryArg.itemsPerPage,
          createdBy: queryArg.createdBy,
          modifiedBy: queryArg.modifiedBy,
          order: queryArg.order,
        },
      }),
    }),
    getV2FeedsById: build.query<
      GetV2FeedsByIdApiResponse,
      GetV2FeedsByIdApiArg
    >({
      query: (queryArg) => ({ url: `/v2/feeds/${queryArg.id}` }),
    }),
    getV2FeedsByIdData: build.query<
      GetV2FeedsByIdDataApiResponse,
      GetV2FeedsByIdDataApiArg
    >({
      query: (queryArg) => ({ url: `/v2/feeds/${queryArg.id}/data` }),
    }),
    getV2Layouts: build.query<GetV2LayoutsApiResponse, GetV2LayoutsApiArg>({
      query: (queryArg) => ({
        url: `/v2/layouts`,
        params: { page: queryArg.page, itemsPerPage: queryArg.itemsPerPage },
      }),
    }),
    getV2LayoutsById: build.query<
      GetV2LayoutsByIdApiResponse,
      GetV2LayoutsByIdApiArg
    >({
      query: (queryArg) => ({ url: `/v2/layouts/${queryArg.id}` }),
    }),
    loginCheckPost: build.mutation<
      LoginCheckPostApiResponse,
      LoginCheckPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/authentication/token`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
    getV2Media: build.query<GetV2MediaApiResponse, GetV2MediaApiArg>({
      query: (queryArg) => ({
        url: `/v2/media`,
        params: {
          page: queryArg.page,
          itemsPerPage: queryArg.itemsPerPage,
          title: queryArg.title,
          description: queryArg.description,
          createdBy: queryArg.createdBy,
          modifiedBy: queryArg.modifiedBy,
          order: queryArg.order,
        },
      }),
    }),
    postMediaCollection: build.mutation<
      PostMediaCollectionApiResponse,
      PostMediaCollectionApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/media`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
    getv2MediaById: build.query<
      Getv2MediaByIdApiResponse,
      Getv2MediaByIdApiArg
    >({
      query: (queryArg) => ({ url: `/v2/media/${queryArg.id}` }),
    }),
    deleteV2MediaById: build.mutation<
      DeleteV2MediaByIdApiResponse,
      DeleteV2MediaByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/media/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
    getV2CampaignsByIdScreenGroups: build.query<
      GetV2CampaignsByIdScreenGroupsApiResponse,
      GetV2CampaignsByIdScreenGroupsApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/campaigns/${queryArg.id}/screen-groups`,
        params: { page: queryArg.page, itemsPerPage: queryArg.itemsPerPage },
      }),
    }),
    getV2CampaignsByIdScreens: build.query<
      GetV2CampaignsByIdScreensApiResponse,
      GetV2CampaignsByIdScreensApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/campaigns/${queryArg.id}/screens`,
        params: { page: queryArg.page, itemsPerPage: queryArg.itemsPerPage },
      }),
    }),
    getV2Playlists: build.query<
      GetV2PlaylistsApiResponse,
      GetV2PlaylistsApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/playlists`,
        params: {
          page: queryArg.page,
          itemsPerPage: queryArg.itemsPerPage,
          title: queryArg.title,
          description: queryArg.description,
          createdBy: queryArg.createdBy,
          modifiedBy: queryArg.modifiedBy,
          published: queryArg.published,
          isCampaign: queryArg.isCampaign,
          order: queryArg.order,
          sharedWithMe: queryArg.sharedWithMe,
        },
      }),
    }),
    postV2Playlists: build.mutation<
      PostV2PlaylistsApiResponse,
      PostV2PlaylistsApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/playlists`,
        method: "POST",
        body: queryArg.playlistPlaylistInput,
      }),
    }),
    getV2PlaylistsById: build.query<
      GetV2PlaylistsByIdApiResponse,
      GetV2PlaylistsByIdApiArg
    >({
      query: (queryArg) => ({ url: `/v2/playlists/${queryArg.id}` }),
    }),
    putV2PlaylistsById: build.mutation<
      PutV2PlaylistsByIdApiResponse,
      PutV2PlaylistsByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/playlists/${queryArg.id}`,
        method: "PUT",
        body: queryArg.playlistPlaylistInput,
      }),
    }),
    deleteV2PlaylistsById: build.mutation<
      DeleteV2PlaylistsByIdApiResponse,
      DeleteV2PlaylistsByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/playlists/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
    getV2PlaylistsByIdSlides: build.query<
      GetV2PlaylistsByIdSlidesApiResponse,
      GetV2PlaylistsByIdSlidesApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/playlists/${queryArg.id}/slides`,
        params: {
          page: queryArg.page,
          itemsPerPage: queryArg.itemsPerPage,
          published: queryArg.published,
        },
      }),
    }),
    putV2PlaylistsByIdSlides: build.mutation<
      PutV2PlaylistsByIdSlidesApiResponse,
      PutV2PlaylistsByIdSlidesApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/playlists/${queryArg.id}/slides`,
        method: "PUT",
        body: queryArg.body,
      }),
    }),
    deleteV2PlaylistsByIdSlidesAndSlideId: build.mutation<
      DeleteV2PlaylistsByIdSlidesAndSlideIdApiResponse,
      DeleteV2PlaylistsByIdSlidesAndSlideIdApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/playlists/${queryArg.id}/slides/${queryArg.slideId}`,
        method: "DELETE",
      }),
    }),
    getV2SlidesByIdPlaylists: build.query<
      GetV2SlidesByIdPlaylistsApiResponse,
      GetV2SlidesByIdPlaylistsApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/slides/${queryArg.id}/playlists`,
        params: {
          page: queryArg.page,
          itemsPerPage: queryArg.itemsPerPage,
          published: queryArg.published,
        },
      }),
    }),
    putV2SlidesByIdPlaylists: build.mutation<
      PutV2SlidesByIdPlaylistsApiResponse,
      PutV2SlidesByIdPlaylistsApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/slides/${queryArg.id}/playlists`,
        method: "PUT",
        body: queryArg.body,
      }),
    }),
    getScreenGroupCampaignItem: build.query<
      GetScreenGroupCampaignItemApiResponse,
      GetScreenGroupCampaignItemApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/screen-groups-campaigns/${queryArg.id}`,
      }),
    }),
    getV2ScreenGroups: build.query<
      GetV2ScreenGroupsApiResponse,
      GetV2ScreenGroupsApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/screen-groups`,
        params: {
          page: queryArg.page,
          itemsPerPage: queryArg.itemsPerPage,
          title: queryArg.title,
          description: queryArg.description,
          createdBy: queryArg.createdBy,
          modifiedBy: queryArg.modifiedBy,
          order: queryArg.order,
        },
      }),
    }),
    postV2ScreenGroups: build.mutation<
      PostV2ScreenGroupsApiResponse,
      PostV2ScreenGroupsApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/screen-groups`,
        method: "POST",
        body: queryArg.screenGroupScreenGroupInput,
      }),
    }),
    getV2ScreenGroupsById: build.query<
      GetV2ScreenGroupsByIdApiResponse,
      GetV2ScreenGroupsByIdApiArg
    >({
      query: (queryArg) => ({ url: `/v2/screen-groups/${queryArg.id}` }),
    }),
    putV2ScreenGroupsById: build.mutation<
      PutV2ScreenGroupsByIdApiResponse,
      PutV2ScreenGroupsByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/screen-groups/${queryArg.id}`,
        method: "PUT",
        body: queryArg.screenGroupScreenGroupInput,
      }),
    }),
    deleteV2ScreenGroupsById: build.mutation<
      DeleteV2ScreenGroupsByIdApiResponse,
      DeleteV2ScreenGroupsByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/screen-groups/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
    getV2ScreenGroupsByIdCampaigns: build.query<
      GetV2ScreenGroupsByIdCampaignsApiResponse,
      GetV2ScreenGroupsByIdCampaignsApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/screen-groups/${queryArg.id}/campaigns`,
        params: {
          page: queryArg.page,
          itemsPerPage: queryArg.itemsPerPage,
          published: queryArg.published,
        },
      }),
    }),
    putV2ScreenGroupsByIdCampaigns: build.mutation<
      PutV2ScreenGroupsByIdCampaignsApiResponse,
      PutV2ScreenGroupsByIdCampaignsApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/screen-groups/${queryArg.id}/campaigns`,
        method: "PUT",
        body: queryArg.body,
      }),
    }),
    deleteV2ScreenGroupsByIdCampaignsAndCampaignId: build.mutation<
      DeleteV2ScreenGroupsByIdCampaignsAndCampaignIdApiResponse,
      DeleteV2ScreenGroupsByIdCampaignsAndCampaignIdApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/screen-groups/${queryArg.id}/campaigns/${queryArg.campaignId}`,
        method: "DELETE",
      }),
    }),
    getV2ScreenGroupsByIdScreens: build.query<
      GetV2ScreenGroupsByIdScreensApiResponse,
      GetV2ScreenGroupsByIdScreensApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/screen-groups/${queryArg.id}/screens`,
        params: { page: queryArg.page, itemsPerPage: queryArg.itemsPerPage },
      }),
    }),
    getV2Screens: build.query<GetV2ScreensApiResponse, GetV2ScreensApiArg>({
      query: (queryArg) => ({
        url: `/v2/screens`,
        params: {
          page: queryArg.page,
          itemsPerPage: queryArg.itemsPerPage,
          search: queryArg.search,
          exists: queryArg.exists,
          "screenUser.latestRequest": queryArg["screenUser.latestRequest"],
          createdBy: queryArg.createdBy,
          modifiedBy: queryArg.modifiedBy,
          order: queryArg.order,
        },
      }),
    }),
    postV2Screens: build.mutation<
      PostV2ScreensApiResponse,
      PostV2ScreensApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/screens`,
        method: "POST",
        body: queryArg.screenScreenInput,
      }),
    }),
    getV2ScreensById: build.query<
      GetV2ScreensByIdApiResponse,
      GetV2ScreensByIdApiArg
    >({
      query: (queryArg) => ({ url: `/v2/screens/${queryArg.id}` }),
    }),
    putV2ScreensById: build.mutation<
      PutV2ScreensByIdApiResponse,
      PutV2ScreensByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/screens/${queryArg.id}`,
        method: "PUT",
        body: queryArg.screenScreenInput,
      }),
    }),
    deleteV2ScreensById: build.mutation<
      DeleteV2ScreensByIdApiResponse,
      DeleteV2ScreensByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/screens/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
    postScreenBindKey: build.mutation<
      PostScreenBindKeyApiResponse,
      PostScreenBindKeyApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/screens/${queryArg.id}/bind`,
        method: "POST",
        body: queryArg.screenBindObject,
      }),
    }),
    getV2ScreensByIdCampaigns: build.query<
      GetV2ScreensByIdCampaignsApiResponse,
      GetV2ScreensByIdCampaignsApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/screens/${queryArg.id}/campaigns`,
        params: {
          page: queryArg.page,
          itemsPerPage: queryArg.itemsPerPage,
          published: queryArg.published,
        },
      }),
    }),
    putV2ScreensByIdCampaigns: build.mutation<
      PutV2ScreensByIdCampaignsApiResponse,
      PutV2ScreensByIdCampaignsApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/screens/${queryArg.id}/campaigns`,
        method: "PUT",
        body: queryArg.body,
      }),
    }),
    deleteV2ScreensByIdCampaignsAndCampaignId: build.mutation<
      DeleteV2ScreensByIdCampaignsAndCampaignIdApiResponse,
      DeleteV2ScreensByIdCampaignsAndCampaignIdApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/screens/${queryArg.id}/campaigns/${queryArg.campaignId}`,
        method: "DELETE",
      }),
    }),
    getV2ScreensByIdRegionsAndRegionIdPlaylists: build.query<
      GetV2ScreensByIdRegionsAndRegionIdPlaylistsApiResponse,
      GetV2ScreensByIdRegionsAndRegionIdPlaylistsApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/screens/${queryArg.id}/regions/${queryArg.regionId}/playlists`,
        params: {
          page: queryArg.page,
          itemsPerPage: queryArg.itemsPerPage,
          sharedWithMe: queryArg.sharedWithMe,
        },
      }),
    }),
    putPlaylistScreenRegionItem: build.mutation<
      PutPlaylistScreenRegionItemApiResponse,
      PutPlaylistScreenRegionItemApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/screens/${queryArg.id}/regions/${queryArg.regionId}/playlists`,
        method: "PUT",
        body: queryArg.body,
      }),
    }),
    deletePlaylistScreenRegionItem: build.mutation<
      DeletePlaylistScreenRegionItemApiResponse,
      DeletePlaylistScreenRegionItemApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/screens/${queryArg.id}/regions/${queryArg.regionId}/playlists/${queryArg.playlistId}`,
        method: "DELETE",
      }),
    }),
    getV2ScreensByIdScreenGroups: build.query<
      GetV2ScreensByIdScreenGroupsApiResponse,
      GetV2ScreensByIdScreenGroupsApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/screens/${queryArg.id}/screen-groups`,
        params: {
          page: queryArg.page,
          itemsPerPage: queryArg.itemsPerPage,
          order: queryArg.order,
        },
      }),
    }),
    putV2ScreensByIdScreenGroups: build.mutation<
      PutV2ScreensByIdScreenGroupsApiResponse,
      PutV2ScreensByIdScreenGroupsApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/screens/${queryArg.id}/screen-groups`,
        method: "PUT",
        body: queryArg.body,
      }),
    }),
    deleteV2ScreensByIdScreenGroupsAndScreenGroupId: build.mutation<
      DeleteV2ScreensByIdScreenGroupsAndScreenGroupIdApiResponse,
      DeleteV2ScreensByIdScreenGroupsAndScreenGroupIdApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/screens/${queryArg.id}/screen-groups/${queryArg.screenGroupId}`,
        method: "DELETE",
      }),
    }),
    postScreenUnbind: build.mutation<
      PostScreenUnbindApiResponse,
      PostScreenUnbindApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/screens/${queryArg.id}/unbind`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
    getV2Slides: build.query<GetV2SlidesApiResponse, GetV2SlidesApiArg>({
      query: (queryArg) => ({
        url: `/v2/slides`,
        params: {
          page: queryArg.page,
          itemsPerPage: queryArg.itemsPerPage,
          title: queryArg.title,
          description: queryArg.description,
          createdBy: queryArg.createdBy,
          modifiedBy: queryArg.modifiedBy,
          published: queryArg.published,
          order: queryArg.order,
        },
      }),
    }),
    postV2Slides: build.mutation<PostV2SlidesApiResponse, PostV2SlidesApiArg>({
      query: (queryArg) => ({
        url: `/v2/slides`,
        method: "POST",
        body: queryArg.slideSlideInput,
      }),
    }),
    getV2SlidesById: build.query<
      GetV2SlidesByIdApiResponse,
      GetV2SlidesByIdApiArg
    >({
      query: (queryArg) => ({ url: `/v2/slides/${queryArg.id}` }),
    }),
    putV2SlidesById: build.mutation<
      PutV2SlidesByIdApiResponse,
      PutV2SlidesByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/slides/${queryArg.id}`,
        method: "PUT",
        body: queryArg.slideSlideInput,
      }),
    }),
    deleteV2SlidesById: build.mutation<
      DeleteV2SlidesByIdApiResponse,
      DeleteV2SlidesByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/slides/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
    apiSlidePerformAction: build.mutation<
      ApiSlidePerformActionApiResponse,
      ApiSlidePerformActionApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/slides/${queryArg.id}/action`,
        method: "POST",
        body: queryArg.slideInteractiveSlideActionInput,
      }),
    }),
    getV2Templates: build.query<
      GetV2TemplatesApiResponse,
      GetV2TemplatesApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/templates`,
        params: {
          page: queryArg.page,
          itemsPerPage: queryArg.itemsPerPage,
          title: queryArg.title,
          description: queryArg.description,
          createdBy: queryArg.createdBy,
          modifiedBy: queryArg.modifiedBy,
          order: queryArg.order,
        },
      }),
    }),
    getV2TemplatesById: build.query<
      GetV2TemplatesByIdApiResponse,
      GetV2TemplatesByIdApiArg
    >({
      query: (queryArg) => ({ url: `/v2/templates/${queryArg.id}` }),
    }),
    getV2Tenants: build.query<GetV2TenantsApiResponse, GetV2TenantsApiArg>({
      query: (queryArg) => ({
        url: `/v2/tenants`,
        params: {
          page: queryArg.page,
          itemsPerPage: queryArg.itemsPerPage,
          title: queryArg.title,
          description: queryArg.description,
          createdBy: queryArg.createdBy,
          modifiedBy: queryArg.modifiedBy,
        },
      }),
    }),
    getV2TenantsById: build.query<
      GetV2TenantsByIdApiResponse,
      GetV2TenantsByIdApiArg
    >({
      query: (queryArg) => ({ url: `/v2/tenants/${queryArg.id}` }),
    }),
    getV2Themes: build.query<GetV2ThemesApiResponse, GetV2ThemesApiArg>({
      query: (queryArg) => ({
        url: `/v2/themes`,
        params: {
          page: queryArg.page,
          itemsPerPage: queryArg.itemsPerPage,
          title: queryArg.title,
          description: queryArg.description,
          createdBy: queryArg.createdBy,
          modifiedBy: queryArg.modifiedBy,
          order: queryArg.order,
        },
      }),
    }),
    postV2Themes: build.mutation<PostV2ThemesApiResponse, PostV2ThemesApiArg>({
      query: (queryArg) => ({
        url: `/v2/themes`,
        method: "POST",
        body: queryArg.themeThemeInput,
      }),
    }),
    getV2ThemesById: build.query<
      GetV2ThemesByIdApiResponse,
      GetV2ThemesByIdApiArg
    >({
      query: (queryArg) => ({ url: `/v2/themes/${queryArg.id}` }),
    }),
    putV2ThemesById: build.mutation<
      PutV2ThemesByIdApiResponse,
      PutV2ThemesByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/themes/${queryArg.id}`,
        method: "PUT",
        body: queryArg.themeThemeInput,
      }),
    }),
    deleteV2ThemesById: build.mutation<
      DeleteV2ThemesByIdApiResponse,
      DeleteV2ThemesByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/themes/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
    getV2Users: build.query<GetV2UsersApiResponse, GetV2UsersApiArg>({
      query: (queryArg) => ({
        url: `/v2/users`,
        params: {
          page: queryArg.page,
          itemsPerPage: queryArg.itemsPerPage,
          fullName: queryArg.fullName,
          email: queryArg.email,
          createdBy: queryArg.createdBy,
          modifiedBy: queryArg.modifiedBy,
          order: queryArg.order,
        },
      }),
    }),
    postV2Users: build.mutation<PostV2UsersApiResponse, PostV2UsersApiArg>({
      query: (queryArg) => ({
        url: `/v2/users`,
        method: "POST",
        body: queryArg.userUserInput,
      }),
    }),
    getV2UsersById: build.query<
      GetV2UsersByIdApiResponse,
      GetV2UsersByIdApiArg
    >({
      query: (queryArg) => ({ url: `/v2/users/${queryArg.id}` }),
    }),
    putV2UsersById: build.mutation<
      PutV2UsersByIdApiResponse,
      PutV2UsersByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/users/${queryArg.id}`,
        method: "PUT",
        body: queryArg.userUserInput,
      }),
    }),
    deleteV2UsersById: build.mutation<
      DeleteV2UsersByIdApiResponse,
      DeleteV2UsersByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/users/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
    deleteV2UsersByIdRemoveFromTenant: build.mutation<
      DeleteV2UsersByIdRemoveFromTenantApiResponse,
      DeleteV2UsersByIdRemoveFromTenantApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/users/${queryArg.id}/remove-from-tenant`,
        method: "DELETE",
      }),
    }),
    getV2UserActivationCodes: build.query<
      GetV2UserActivationCodesApiResponse,
      GetV2UserActivationCodesApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/user-activation-codes`,
        params: { page: queryArg.page, itemsPerPage: queryArg.itemsPerPage },
      }),
    }),
    postV2UserActivationCodes: build.mutation<
      PostV2UserActivationCodesApiResponse,
      PostV2UserActivationCodesApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/user-activation-codes`,
        method: "POST",
        body: queryArg.userActivationCodeUserActivationCodeInput,
      }),
    }),
    postV2UserActivationCodesActivate: build.mutation<
      PostV2UserActivationCodesActivateApiResponse,
      PostV2UserActivationCodesActivateApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/user-activation-codes/activate`,
        method: "POST",
        body: queryArg.userActivationCodeActivationCode,
      }),
    }),
    postV2UserActivationCodesRefresh: build.mutation<
      PostV2UserActivationCodesRefreshApiResponse,
      PostV2UserActivationCodesRefreshApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/user-activation-codes/refresh`,
        method: "POST",
        body: queryArg.userActivationCodeActivationCode,
      }),
    }),
    getV2UserActivationCodesById: build.query<
      GetV2UserActivationCodesByIdApiResponse,
      GetV2UserActivationCodesByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/user-activation-codes/${queryArg.id}`,
      }),
    }),
    deleteV2UserActivationCodesById: build.mutation<
      DeleteV2UserActivationCodesByIdApiResponse,
      DeleteV2UserActivationCodesByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/v2/user-activation-codes/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
  }),
});
export type GetOidcAuthTokenItemApiResponse =
  /** status 200 Get JWT token from OIDC code */ Token;
export type GetOidcAuthTokenItemApiArg = {
  /** OIDC state */
  state?: string;
  /** OIDC code */
  code?: string;
};
export type GetOidcAuthUrlsItemApiResponse =
  /** status 200 Get authentication and end session endpoints */ OidcEndpoints;
export type GetOidcAuthUrlsItemApiArg = {
  /** The key for the provider to use. Leave out to use the default provider */
  providerKey?: string;
};
export type PostLoginInfoScreenApiResponse =
  /** status 200 Login with bindKey to get JWT token for screen */ ScreenLoginOutput;
export type PostLoginInfoScreenApiArg = {
  /** Get login info with JWT token for given nonce */
  screenLoginInput: ScreenLoginInput;
};
export type PostRefreshTokenItemApiResponse =
  /** status 200 Refresh JWT token */ RefreshTokenResponse;
export type PostRefreshTokenItemApiArg = {
  /** Refresh JWT Token */
  refreshTokenRequest: RefreshTokenRequest;
};
export type GetV2FeedSourcesApiResponse = unknown;
export type GetV2FeedSourcesApiArg = {
  page?: number;
  /** The number of items per page */
  itemsPerPage?: string;
  supportedFeedOutputType?: {
    ""?: string[];
  };
  title?: string;
  description?: string;
  createdBy?: {
    ""?: string[];
  };
  modifiedBy?: {
    ""?: string[];
  };
  order?: {
    title?: "asc" | "desc";
    description?: "asc" | "desc";
    createdAt?: "asc" | "desc";
    modifiedAt?: "asc" | "desc";
  };
};
export type PostV2FeedSourcesApiResponse = unknown;
export type PostV2FeedSourcesApiArg = {
  /** The new FeedSource resource */
  feedSourceFeedSourceInput: FeedSourceFeedSourceInput;
};
export type GetV2FeedSourcesByIdApiResponse = unknown;
export type GetV2FeedSourcesByIdApiArg = {
  id: string;
};
export type PutV2FeedSourcesByIdApiResponse = unknown;
export type PutV2FeedSourcesByIdApiArg = {
  id: string;
  /** The updated FeedSource resource */
  feedSourceFeedSourceInput: FeedSourceFeedSourceInput;
};
export type DeleteV2FeedSourcesByIdApiResponse = unknown;
export type DeleteV2FeedSourcesByIdApiArg = {
  id: string;
};
export type GetV2FeedSourcesByIdSlidesApiResponse = unknown;
export type GetV2FeedSourcesByIdSlidesApiArg = {
  id: string;
  page: number;
  /** The number of items per page */
  itemsPerPage?: string;
  title?: string;
  description?: string;
  createdBy?: {
    ""?: string[];
  };
  modifiedBy?: {
    ""?: string[];
  };
  /** If true only published content will be shown */
  published?: boolean;
  order?: {
    title?: "asc" | "desc";
    description?: "asc" | "desc";
    createdAt?: "asc" | "desc";
    modifiedAt?: "asc" | "desc";
  };
};
export type GetV2FeedSourcesByIdConfigAndNameApiResponse = unknown;
export type GetV2FeedSourcesByIdConfigAndNameApiArg = {
  id: string;
  name: string;
};
export type GetV2FeedsApiResponse = unknown;
export type GetV2FeedsApiArg = {
  page?: number;
  /** The number of items per page */
  itemsPerPage?: string;
  createdBy?: {
    ""?: string[];
  };
  modifiedBy?: {
    ""?: string[];
  };
  order?: {
    createdAt?: "asc" | "desc";
    modifiedAt?: "asc" | "desc";
  };
};
export type GetV2FeedsByIdApiResponse = unknown;
export type GetV2FeedsByIdApiArg = {
  id: string;
};
export type GetV2FeedsByIdDataApiResponse = /** status 200 undefined */ Blob;
export type GetV2FeedsByIdDataApiArg = {
  id: string;
};
export type GetV2LayoutsApiResponse = unknown;
export type GetV2LayoutsApiArg = {
  page?: number;
  /** The number of items per page */
  itemsPerPage?: number;
};
export type GetV2LayoutsByIdApiResponse = unknown;
export type GetV2LayoutsByIdApiArg = {
  id: string;
};
export type LoginCheckPostApiResponse = /** status 200 User token created */ {
  token: string;
};
export type LoginCheckPostApiArg = {
  /** The login data */
  body: {
    providerId: string;
    password: string;
  };
};
export type GetV2MediaApiResponse = unknown;
export type GetV2MediaApiArg = {
  page?: number;
  /** The number of items per page */
  itemsPerPage?: string;
  title?: string;
  description?: string;
  createdBy?: {
    ""?: string[];
  };
  modifiedBy?: {
    ""?: string[];
  };
  order?: {
    title?: "asc" | "desc";
    description?: "asc" | "desc";
    createdAt?: "asc" | "desc";
    modifiedAt?: "asc" | "desc";
  };
};
export type PostMediaCollectionApiResponse = unknown;
export type PostMediaCollectionApiArg = {
  body: {
    title: string;
    description: string;
    license: string;
    file: Blob;
  };
};
export type Getv2MediaByIdApiResponse = unknown;
export type Getv2MediaByIdApiArg = {
  id: string;
};
export type DeleteV2MediaByIdApiResponse = unknown;
export type DeleteV2MediaByIdApiArg = {
  id: string;
};
export type GetV2CampaignsByIdScreenGroupsApiResponse = unknown;
export type GetV2CampaignsByIdScreenGroupsApiArg = {
  id: string;
  page?: number;
  /** The number of items per page */
  itemsPerPage?: string;
};
export type GetV2CampaignsByIdScreensApiResponse = unknown;
export type GetV2CampaignsByIdScreensApiArg = {
  id: string;
  page?: number;
  /** The number of items per page */
  itemsPerPage?: string;
};
export type GetV2PlaylistsApiResponse = unknown;
export type GetV2PlaylistsApiArg = {
  page: number;
  /** The number of items per page */
  itemsPerPage?: number;
  title?: string;
  description?: string;
  createdBy?: {
    ""?: string[];
  };
  modifiedBy?: {
    ""?: string[];
  };
  /** If true only published content will be shown */
  published?: boolean;
  /** If true only campaigns will be shown */
  isCampaign?: boolean;
  order?: {
    title?: "asc" | "desc";
    description?: "asc" | "desc";
    createdAt?: "asc" | "desc";
    modifiedAt?: "asc" | "desc";
  };
  /** If true only entities that are shared with me will be shown */
  sharedWithMe?: boolean;
};
export type PostV2PlaylistsApiResponse = unknown;
export type PostV2PlaylistsApiArg = {
  /** The new Playlist resource */
  playlistPlaylistInput: PlaylistPlaylistInput;
};
export type GetV2PlaylistsByIdApiResponse = unknown;
export type GetV2PlaylistsByIdApiArg = {
  id: string;
};
export type PutV2PlaylistsByIdApiResponse = unknown;
export type PutV2PlaylistsByIdApiArg = {
  id: string;
  /** The updated Playlist resource */
  playlistPlaylistInput: PlaylistPlaylistInput;
};
export type DeleteV2PlaylistsByIdApiResponse = unknown;
export type DeleteV2PlaylistsByIdApiArg = {
  id: string;
};
export type GetV2PlaylistsByIdSlidesApiResponse = unknown;
export type GetV2PlaylistsByIdSlidesApiArg = {
  id: string;
  page: number;
  /** The number of items per page */
  itemsPerPage?: string;
  /** If true only published content will be shown */
  published?: boolean;
};
export type PutV2PlaylistsByIdSlidesApiResponse = unknown;
export type PutV2PlaylistsByIdSlidesApiArg = {
  /** PlaylistSlide identifier */
  id: string;
  body: Blob;
};
export type DeleteV2PlaylistsByIdSlidesAndSlideIdApiResponse = unknown;
export type DeleteV2PlaylistsByIdSlidesAndSlideIdApiArg = {
  id: string;
  slideId: string;
};
export type GetV2SlidesByIdPlaylistsApiResponse = unknown;
export type GetV2SlidesByIdPlaylistsApiArg = {
  id: string;
  page?: number;
  /** The number of items per page */
  itemsPerPage?: string;
  /** If true only published content will be shown */
  published?: boolean;
};
export type PutV2SlidesByIdPlaylistsApiResponse = unknown;
export type PutV2SlidesByIdPlaylistsApiArg = {
  id: string;
  body: Blob;
};
export type GetScreenGroupCampaignItemApiResponse = unknown;
export type GetScreenGroupCampaignItemApiArg = {
  /** ScreenGroupCampaign identifier */
  id: string;
};
export type GetV2ScreenGroupsApiResponse = unknown;
export type GetV2ScreenGroupsApiArg = {
  page?: number;
  /** The number of items per page */
  itemsPerPage?: string;
  title?: string;
  description?: string;
  createdBy?: {
    ""?: string[];
  };
  modifiedBy?: {
    ""?: string[];
  };
  order?: {
    title?: "asc" | "desc";
    description?: "asc" | "desc";
    createdAt?: "asc" | "desc";
  };
};
export type PostV2ScreenGroupsApiResponse = unknown;
export type PostV2ScreenGroupsApiArg = {
  /** The new ScreenGroup resource */
  screenGroupScreenGroupInput: ScreenGroupScreenGroupInput;
};
export type GetV2ScreenGroupsByIdApiResponse = unknown;
export type GetV2ScreenGroupsByIdApiArg = {
  id: string;
};
export type PutV2ScreenGroupsByIdApiResponse = unknown;
export type PutV2ScreenGroupsByIdApiArg = {
  id: string;
  /** The updated ScreenGroup resource */
  screenGroupScreenGroupInput: ScreenGroupScreenGroupInput;
};
export type DeleteV2ScreenGroupsByIdApiResponse = unknown;
export type DeleteV2ScreenGroupsByIdApiArg = {
  id: string;
};
export type GetV2ScreenGroupsByIdCampaignsApiResponse = unknown;
export type GetV2ScreenGroupsByIdCampaignsApiArg = {
  id: string;
  page: number;
  /** The number of items per page */
  itemsPerPage?: string;
  /** If true only published content will be shown */
  published?: boolean;
};
export type PutV2ScreenGroupsByIdCampaignsApiResponse = unknown;
export type PutV2ScreenGroupsByIdCampaignsApiArg = {
  /** ScreenGroupCampaign identifier */
  id: string;
  body: Blob;
};
export type DeleteV2ScreenGroupsByIdCampaignsAndCampaignIdApiResponse = unknown;
export type DeleteV2ScreenGroupsByIdCampaignsAndCampaignIdApiArg = {
  id: string;
  campaignId: string;
};
export type GetV2ScreenGroupsByIdScreensApiResponse = unknown;
export type GetV2ScreenGroupsByIdScreensApiArg = {
  id: string;
  page?: number;
  /** The number of items per page */
  itemsPerPage?: string;
};
export type GetV2ScreensApiResponse = unknown;
export type GetV2ScreensApiArg = {
  page?: number;
  /** The number of items per page */
  itemsPerPage?: string;
  /** Search on both location and title */
  search?: string;
  exists?: {
    screenUser?: boolean;
  };
  "screenUser.latestRequest"?: {
    before?: string;
    strictly_before?: string;
    after?: string;
    strictly_after?: string;
  };
  createdBy?: {
    ""?: string[];
  };
  modifiedBy?: {
    ""?: string[];
  };
  order?: {
    title?: "asc" | "desc";
    description?: "asc" | "desc";
    createdAt?: "asc" | "desc";
    modifiedAt?: "asc" | "desc";
  };
};
export type PostV2ScreensApiResponse = unknown;
export type PostV2ScreensApiArg = {
  /** The new Screen resource */
  screenScreenInput: ScreenScreenInput;
};
export type GetV2ScreensByIdApiResponse = unknown;
export type GetV2ScreensByIdApiArg = {
  id: string;
};
export type PutV2ScreensByIdApiResponse = unknown;
export type PutV2ScreensByIdApiArg = {
  id: string;
  /** The updated Screen resource */
  screenScreenInput: ScreenScreenInput;
};
export type DeleteV2ScreensByIdApiResponse = unknown;
export type DeleteV2ScreensByIdApiArg = {
  id: string;
};
export type PostScreenBindKeyApiResponse = unknown;
export type PostScreenBindKeyApiArg = {
  /** The screen id */
  id: string;
  /** Bind the screen with the bind key */
  screenBindObject: ScreenBindObject;
};
export type GetV2ScreensByIdCampaignsApiResponse = unknown;
export type GetV2ScreensByIdCampaignsApiArg = {
  id: string;
  page: number;
  /** The number of items per page */
  itemsPerPage?: string;
  /** If true only published content will be shown */
  published?: boolean;
};
export type PutV2ScreensByIdCampaignsApiResponse = unknown;
export type PutV2ScreensByIdCampaignsApiArg = {
  /** ScreenCampaign identifier */
  id: string;
  body: Blob;
};
export type DeleteV2ScreensByIdCampaignsAndCampaignIdApiResponse = unknown;
export type DeleteV2ScreensByIdCampaignsAndCampaignIdApiArg = {
  id: string;
  campaignId: string;
};
export type GetV2ScreensByIdRegionsAndRegionIdPlaylistsApiResponse = unknown;
export type GetV2ScreensByIdRegionsAndRegionIdPlaylistsApiArg = {
  id: string;
  regionId: string;
  page: number;
  /** The number of items per page */
  itemsPerPage?: string;
  /** If true only entities that are shared with me will be shown */
  sharedWithMe?: boolean;
};
export type PutPlaylistScreenRegionItemApiResponse = unknown;
export type PutPlaylistScreenRegionItemApiArg = {
  id: string;
  regionId: string;
  body: Blob;
};
export type DeletePlaylistScreenRegionItemApiResponse = unknown;
export type DeletePlaylistScreenRegionItemApiArg = {
  id: string;
  regionId: string;
  playlistId: string;
};
export type GetV2ScreensByIdScreenGroupsApiResponse = unknown;
export type GetV2ScreensByIdScreenGroupsApiArg = {
  id: string;
  page: number;
  /** The number of items per page */
  itemsPerPage?: string;
  order?: {
    title?: "asc" | "desc";
    description?: "asc" | "desc";
  };
};
export type PutV2ScreensByIdScreenGroupsApiResponse = unknown;
export type PutV2ScreensByIdScreenGroupsApiArg = {
  id: string;
  body: string[];
};
export type DeleteV2ScreensByIdScreenGroupsAndScreenGroupIdApiResponse =
  unknown;
export type DeleteV2ScreensByIdScreenGroupsAndScreenGroupIdApiArg = {
  id: string;
  screenGroupId: string;
};
export type PostScreenUnbindApiResponse = unknown;
export type PostScreenUnbindApiArg = {
  /** The screen id */
  id: string;
  /** Unbind from machine */
  body: string;
};
export type GetV2SlidesApiResponse = unknown;
export type GetV2SlidesApiArg = {
  page?: number;
  /** The number of items per page */
  itemsPerPage?: string;
  title?: string;
  description?: string;
  createdBy?: {
    ""?: string[];
  };
  modifiedBy?: {
    ""?: string[];
  };
  /** If true only published content will be shown */
  published?: boolean;
  order?: {
    title?: "asc" | "desc";
    description?: "asc" | "desc";
    createdAt?: "asc" | "desc";
    modifiedAt?: "asc" | "desc";
  };
};
export type PostV2SlidesApiResponse = unknown;
export type PostV2SlidesApiArg = {
  /** The new Slide resource */
  slideSlideInput: SlideSlideInput;
};
export type GetV2SlidesByIdApiResponse = unknown;
export type GetV2SlidesByIdApiArg = {
  id: string;
};
export type PutV2SlidesByIdApiResponse = unknown;
export type PutV2SlidesByIdApiArg = {
  id: string;
  /** The updated Slide resource */
  slideSlideInput: SlideSlideInput;
};
export type DeleteV2SlidesByIdApiResponse = unknown;
export type DeleteV2SlidesByIdApiArg = {
  id: string;
};
export type ApiSlidePerformActionApiResponse = unknown;
export type ApiSlidePerformActionApiArg = {
  id: string;
  /** The new Slide resource */
  slideInteractiveSlideActionInput: SlideInteractiveSlideActionInput;
};
export type GetV2TemplatesApiResponse = unknown;
export type GetV2TemplatesApiArg = {
  page?: number;
  /** The number of items per page */
  itemsPerPage?: string;
  title?: string;
  description?: string;
  createdBy?: {
    ""?: string[];
  };
  modifiedBy?: {
    ""?: string[];
  };
  order?: {
    createdAt?: "asc" | "desc";
    modifiedAt?: "asc" | "desc";
  };
};
export type GetV2TemplatesByIdApiResponse = unknown;
export type GetV2TemplatesByIdApiArg = {
  id: string;
};
export type GetV2TenantsApiResponse = unknown;
export type GetV2TenantsApiArg = {
  page?: number;
  /** The number of items per page */
  itemsPerPage?: string;
  title?: string;
  description?: string;
  createdBy?: {
    ""?: string[];
  };
  modifiedBy?: {
    ""?: string[];
  };
};
export type GetV2TenantsByIdApiResponse = unknown;
export type GetV2TenantsByIdApiArg = {
  id: string;
};
export type GetV2ThemesApiResponse = unknown;
export type GetV2ThemesApiArg = {
  page?: number;
  /** The number of items per page */
  itemsPerPage?: string;
  title?: string;
  description?: string;
  createdBy?: {
    ""?: string[];
  };
  modifiedBy?: {
    ""?: string[];
  };
  order?: {
    title?: "asc" | "desc";
    description?: "asc" | "desc";
    createdAt?: "asc" | "desc";
    modifiedAt?: "asc" | "desc";
  };
};
export type PostV2ThemesApiResponse = unknown;
export type PostV2ThemesApiArg = {
  /** The new Theme resource */
  themeThemeInput: ThemeThemeInput;
};
export type GetV2ThemesByIdApiResponse = unknown;
export type GetV2ThemesByIdApiArg = {
  id: string;
};
export type PutV2ThemesByIdApiResponse = unknown;
export type PutV2ThemesByIdApiArg = {
  id: string;
  /** The updated Theme resource */
  themeThemeInput: ThemeThemeInput;
};
export type DeleteV2ThemesByIdApiResponse = unknown;
export type DeleteV2ThemesByIdApiArg = {
  id: string;
};
export type GetV2UsersApiResponse = unknown;
export type GetV2UsersApiArg = {
  page?: number;
  /** The number of items per page */
  itemsPerPage?: string;
  fullName?: string;
  email?: string;
  createdBy?: {
    ""?: string[];
  };
  modifiedBy?: {
    ""?: string[];
  };
  order?: {
    createdAt?: "asc" | "desc";
  };
};
export type PostV2UsersApiResponse = unknown;
export type PostV2UsersApiArg = {
  id: string;
  /** The new User resource */
  userUserInput: UserUserInput;
};
export type GetV2UsersByIdApiResponse = unknown;
export type GetV2UsersByIdApiArg = {
  id: string;
};
export type PutV2UsersByIdApiResponse = unknown;
export type PutV2UsersByIdApiArg = {
  id: string;
  /** The updated User resource */
  userUserInput: UserUserInput;
};
export type DeleteV2UsersByIdApiResponse = unknown;
export type DeleteV2UsersByIdApiArg = {
  id: string;
};
export type DeleteV2UsersByIdRemoveFromTenantApiResponse = unknown;
export type DeleteV2UsersByIdRemoveFromTenantApiArg = {
  id: string;
};
export type GetV2UserActivationCodesApiResponse = unknown;
export type GetV2UserActivationCodesApiArg = {
  /** The collection page number */
  page?: number;
  /** The number of items per page */
  itemsPerPage?: number;
};
export type PostV2UserActivationCodesApiResponse = unknown;
export type PostV2UserActivationCodesApiArg = {
  /** The new UserActivationCode resource */
  userActivationCodeUserActivationCodeInput: UserActivationCodeUserActivationCodeInput;
};
export type PostV2UserActivationCodesActivateApiResponse = unknown;
export type PostV2UserActivationCodesActivateApiArg = {
  /** The new UserActivationCode resource */
  userActivationCodeActivationCode: UserActivationCodeActivationCode;
};
export type PostV2UserActivationCodesRefreshApiResponse = unknown;
export type PostV2UserActivationCodesRefreshApiArg = {
  /** The new UserActivationCode resource */
  userActivationCodeActivationCode: UserActivationCodeActivationCode;
};
export type GetV2UserActivationCodesByIdApiResponse = unknown;
export type GetV2UserActivationCodesByIdApiArg = {
  /** UserActivationCode identifier */
  id: string;
};
export type DeleteV2UserActivationCodesByIdApiResponse = unknown;
export type DeleteV2UserActivationCodesByIdApiArg = {
  /** UserActivationCode identifier */
  id: string;
};
export type Token = {
  token?: string;
  refresh_token?: string;
  refresh_token_expiration?: any;
  tenants?: {
    tenantKey?: string;
    title?: string;
    description?: string;
    roles?: string[];
  }[];
  user?: {
    fullname?: string;
    email?: string;
  };
};
export type OidcEndpoints = {
  authorizationUrl?: string;
  endSessionUrl?: string;
};
export type ScreenLoginOutput = {
  bindKey?: string;
  token?: string;
};
export type ScreenLoginInput = object;
export type RefreshTokenResponse = {
  token?: string;
  refresh_token?: string;
};
export type RefreshTokenRequest = {
  refresh_token?: string;
};
export type FeedSourceFeedSourceInput = {
  title?: string;
  description?: string;
  outputType?: string;
  feedType?: string;
  secrets?: string[];
  feeds?: string[];
  supportedFeedOutputType?: string;
};
export type PlaylistPlaylistInput = {
  title?: string;
  description?: string;
  schedules?: string[];
  tenants?: string[];
  isCampaign?: boolean;
  published?: string[];
};
export type ScreenGroupScreenGroupInput = {
  title?: string;
  description?: string;
};
export type ScreenScreenInput = {
  title?: string;
  description?: string;
  size?: string;
  layout?: string;
  location?: string;
  resolution?: string;
  orientation?: string;
  enableColorSchemeChange?: any;
  regions?: string[];
  groups?: string[];
};
export type ScreenBindObject = {
  bindKey?: string;
};
export type SlideSlideInput = {
  title?: string;
  description?: string;
  templateInfo?: string[];
  theme?: string;
  duration?: any;
  published?: string[];
  feed?: string[];
  media?: string[];
  content?: string[];
};
export type SlideInteractiveSlideActionInput = {
  action?: any;
  data?: string[];
};
export type ThemeThemeInput = {
  title?: string;
  description?: string;
  logo?: string;
  css?: string;
};
export type UserUserInput = {
  fullName?: any;
};
export type UserActivationCodeUserActivationCodeInput = {
  displayName?: string;
  roles?: string[];
};
export type UserActivationCodeActivationCode = {
  activationCode?: string;
};
export const {
  useGetOidcAuthTokenItemQuery,
  useGetOidcAuthUrlsItemQuery,
  usePostLoginInfoScreenMutation,
  usePostRefreshTokenItemMutation,
  useGetV2FeedSourcesQuery,
  usePostV2FeedSourcesMutation,
  useGetV2FeedSourcesByIdQuery,
  usePutV2FeedSourcesByIdMutation,
  useDeleteV2FeedSourcesByIdMutation,
  useGetV2FeedSourcesByIdSlidesQuery,
  useGetV2FeedSourcesByIdConfigAndNameQuery,
  useGetV2FeedsQuery,
  useGetV2FeedsByIdQuery,
  useGetV2FeedsByIdDataQuery,
  useGetV2LayoutsQuery,
  useGetV2LayoutsByIdQuery,
  useLoginCheckPostMutation,
  useGetV2MediaQuery,
  usePostMediaCollectionMutation,
  useGetv2MediaByIdQuery,
  useDeleteV2MediaByIdMutation,
  useGetV2CampaignsByIdScreenGroupsQuery,
  useGetV2CampaignsByIdScreensQuery,
  useGetV2PlaylistsQuery,
  usePostV2PlaylistsMutation,
  useGetV2PlaylistsByIdQuery,
  usePutV2PlaylistsByIdMutation,
  useDeleteV2PlaylistsByIdMutation,
  useGetV2PlaylistsByIdSlidesQuery,
  usePutV2PlaylistsByIdSlidesMutation,
  useDeleteV2PlaylistsByIdSlidesAndSlideIdMutation,
  useGetV2SlidesByIdPlaylistsQuery,
  usePutV2SlidesByIdPlaylistsMutation,
  useGetScreenGroupCampaignItemQuery,
  useGetV2ScreenGroupsQuery,
  usePostV2ScreenGroupsMutation,
  useGetV2ScreenGroupsByIdQuery,
  usePutV2ScreenGroupsByIdMutation,
  useDeleteV2ScreenGroupsByIdMutation,
  useGetV2ScreenGroupsByIdCampaignsQuery,
  usePutV2ScreenGroupsByIdCampaignsMutation,
  useDeleteV2ScreenGroupsByIdCampaignsAndCampaignIdMutation,
  useGetV2ScreenGroupsByIdScreensQuery,
  useGetV2ScreensQuery,
  usePostV2ScreensMutation,
  useGetV2ScreensByIdQuery,
  usePutV2ScreensByIdMutation,
  useDeleteV2ScreensByIdMutation,
  usePostScreenBindKeyMutation,
  useGetV2ScreensByIdCampaignsQuery,
  usePutV2ScreensByIdCampaignsMutation,
  useDeleteV2ScreensByIdCampaignsAndCampaignIdMutation,
  useGetV2ScreensByIdRegionsAndRegionIdPlaylistsQuery,
  usePutPlaylistScreenRegionItemMutation,
  useDeletePlaylistScreenRegionItemMutation,
  useGetV2ScreensByIdScreenGroupsQuery,
  usePutV2ScreensByIdScreenGroupsMutation,
  useDeleteV2ScreensByIdScreenGroupsAndScreenGroupIdMutation,
  usePostScreenUnbindMutation,
  useGetV2SlidesQuery,
  usePostV2SlidesMutation,
  useGetV2SlidesByIdQuery,
  usePutV2SlidesByIdMutation,
  useDeleteV2SlidesByIdMutation,
  useApiSlidePerformActionMutation,
  useGetV2TemplatesQuery,
  useGetV2TemplatesByIdQuery,
  useGetV2TenantsQuery,
  useGetV2TenantsByIdQuery,
  useGetV2ThemesQuery,
  usePostV2ThemesMutation,
  useGetV2ThemesByIdQuery,
  usePutV2ThemesByIdMutation,
  useDeleteV2ThemesByIdMutation,
  useGetV2UsersQuery,
  usePostV2UsersMutation,
  useGetV2UsersByIdQuery,
  usePutV2UsersByIdMutation,
  useDeleteV2UsersByIdMutation,
  useDeleteV2UsersByIdRemoveFromTenantMutation,
  useGetV2UserActivationCodesQuery,
  usePostV2UserActivationCodesMutation,
  usePostV2UserActivationCodesActivateMutation,
  usePostV2UserActivationCodesRefreshMutation,
  useGetV2UserActivationCodesByIdQuery,
  useDeleteV2UserActivationCodesByIdMutation,
} = api;

