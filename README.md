<h1><b>Survey Application</b></h1>
<p> This is the repo for the back-end Survey application. View the deployed site here: https://mongolians.github.io/survey-client/. The app lets users create surveys and collect responses on a 1-5 scale (Strongly Disagree to Strongly Agree). Survey takers can sign in, take surveys, and view results in a dashboard. More information on the client-side application can be found at https://github.com/mongolians/survey-client. </p>
<h3> Goal: </h3>
<p> The goal of this project is to develop a full-stack survey application.
</p>
<h3> Technologies Used: </h3>
<ul>
  <li>Atom Editor</li>
  <li>Express.js</li>
  <li>Github</li>
  <li>Heroku</li>
  <li>Mongo/Mongoose</li>
</ul>

<h3> Planning Process & Development</h3>
<p>The first step in the development process was to establish the Entity Relationship Diagram (ERD).


 The group tested user authentication and user actions with CURL scripts. .</p>
<a href="https://imgur.com/SEOldxl">View ERD </a>
<h3>API Endpoints </h3>
<table>
  <thead>
    <tr>
      <th align="center">Verb</th>
      <th align="center">URI</th>
      <th align="center">Controller#Action</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">POST</td>
      <td align="center"><code>/sign-up</code></td>
      <td align="center"><code>users#signup</code></td>
    </tr>
    <tr>
      <td align="center">POST</td>
      <td align="center"><code>/sign-in</code></td>
      <td align="center"><code>users#signin</code></td>
    </tr>
    <tr>
      <td align="center">PATCH</td>
      <td align="center"><code>/change-password</code></td>
      <td align="center"><code>users#changepw</code></td>
    </tr>
    <tr>
      <td align="center">DELETE</td>
      <td align="center"><code>/sign-out</code></td>
      <td align="center"><code>users#signout</code></td>
    </tr>
  </tbody>
</table>
<table>
  <thead>
    <tr>
      <th align="center">Verb</th>
      <th align="center">URI</th>
      <th align="center">Controller#Action</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">GET</td>
      <td align="center"><code>/answers</code></td>
      <td align="center"><code>answers#index</code></td>
    </tr>
    <tr>
      <td align="center">POST</td>
      <td align="center"><code>/answers</code></td>
      <td align="center"><code>answers#create</code></td>
    </tr>
  </tbody>
</table>
<table>
  <thead>
    <tr>
      <th align="center">Verb</th>
      <th align="center">URI</th>
      <th align="center">Controller#Action</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">GET</td>
      <td align="center"><code>/surveys</code></td>
      <td align="center"><code>surveys#index</code></td>
    </tr>
    <tr>
      <td align="center">POST</td>
      <td align="center"><code>/surveys</code></td>
      <td align="center"><code>surveys#create</code></td>
    </tr>
    <tr>
      <td align="center">PATCH</td>
      <td align="center"><code>/surveys/ + data.survey.id</code></td>
      <td align="center"><code>surveys#update</code></td>
    </tr>
    <tr>
      <td align="center">DELETE</td>
      <td align="center"><code>/surveys/ + data</code></td>
      <td align="center"><code>surveys#delete</code></td>
    </tr>
  </tbody>
  </table>

  <h3> Next Steps: </h3>
  <p>
