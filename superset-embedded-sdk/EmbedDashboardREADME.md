# Superset Embedded SDK

The Embedded SDK allows you to embed dashboards from Superset into your own app,
using your app's authentication.

Embedding is done by inserting an iframe, containing a Superset page, into the host application.

## Enable Embed Dashboard

Enable Embed Dashboard by adding below flag in superset_config.py file. This will give an option for dashboard to Embed.

FEATURE_FLAGS = {"EMBEDDED_SUPERSET": True}

Add the below code in config.py to allow this role based user to embed dashboard

GUEST_ROLE_NAME = "Gamma"

WTF_CSRF_ENABLED = False

### Configuring role and dashboard in Apache Superset Client side

Create a role named Gamma and give the below permissions (last page in the document) for which we need to assign this Role in config.py as said in the previous step.

After clicking the embed dashboard option add the list of domain names that can embed the dashboard and click on the enable embedding button. Then you can find the dashboard ID and pass that to the SDK

#### Embedding a Dashboard

Using npm:

```sh
npm install --save @superset-ui/embedded-sdk
```

```js
import { embedDashboard } from "@superset-ui/embedded-sdk";

embedDashboard({
  id: "abc123", // given by the Superset embedding UI
  supersetDomain: "https://superset.example.com",
  mountPoint: document.getElementById("my-superset-container"), // any html element that can contain an iframe
  fetchGuestToken: () => fetchGuestTokenFromBackend(),
  dashboardUiConfig: {
    // dashboard UI config: hideTitle, hideTab, hideChartControls, filters.visible, filters.expanded (optional)
    hideTitle: true,
    filters: {
      expanded: true,
    },
  },
});
```

You can also load the Embedded SDK from a CDN. The SDK will be available as `supersetEmbeddedSdk` globally:

```html
<script src="https://unpkg.com/@superset-ui/embedded-sdk"></script>

<script>
  supersetEmbeddedSdk.embedDashboard({
    // ... here you supply the same parameters as in the example above
  });
</script>
```

##### Authentication/Authorization with Guest Tokens

Embedded resources use a special auth token called a Guest Token to grant Superset access to your users,
without requiring your users to log in to Superset directly. Your backend must create a Guest Token
by requesting Superset's `POST /api/v1/security/guest_token` endpoint, and pass that guest token to your frontend.

The Embedding SDK takes the guest token and use it to embed a dashboard.

###### Creating a Guest Token

From the backend, http `POST` to `/api/v1/security/guest_token` with some parameters to define what the guest token will grant access to.

The parameters to get a guest token are the access and csrf tokens which can be generated by hitting `POST /api/v1/security/login` and `GET /api/v1/security/csrf_token` endpoints respectively.

Guest tokens can have Row Level Security rules which filter data for the user carrying the token.

The agent making the `POST` request must be authenticated with the `can_grant_guest_token` permission.

Example `POST /api/v1/security/login` payload:

```json
{
    "username": "admin",
    "password ": "dmin",
    "provider": "db",
    "refresh": true
},
{
    "headers": {
        "Content-Type": "application/json",
    },
}
```

Note: Response here is stored from `response.data.access_token` to accessToken variable and it is passed to the csrf_token endpoint to get csrfToken in the next step.

Example `GET /api/v1/security/csrf_token` payload:

```json
{
  "headers": {
    "Authorization": "Bearer ${accessToken}"
  }
}
```

Note: This csrfToken from the API response and the accessToken are passed in headers to guest_token endpoint as in the next step.

Example `POST /api/v1/security/guest_token` payload:

```json
{
  "user": {
    "username": "stan_lee",
    "first_name": "Stan",
    "last_name": "Lee"
  },
  "resources": [
    {
      "type": "dashboard",
      "id": "abc123"
    }
  ],
  "rls": [],
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${accessToken}",
    "X-CSRFToken": "csrfToken"
  }
}
```