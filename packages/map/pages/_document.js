import Document, {Html, Head, Main, NextScript} from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <title> &raquo; DPG Map</title>
          <link
            rel="icon"
            type="image/png"
            href="/wp-content/themes/dpga/favicon.png?v1622233620"
          />
          <meta name="robots" content="max-image-preview:large" />
          <link
            rel="stylesheet"
            id="wp-block-library-css"
            href="/wp-includes/css/dist/block-library/style.min.css"
            type="text/css"
            media="all"
          />
          <link
            rel="stylesheet"
            id="dpga-style-css"
            href="/wp-content/themes/dpga/style.css"
            type="text/css"
            media="all"
          />
          <link
            rel="stylesheet"
            id="dpga-fontello-css"
            href="/wp-content/themes/dpga/fontello/css/fontello.css"
            type="text/css"
            media="all"
          />
          <link
            rel="stylesheet"
            id="dpga-style-main-css"
            href="/wp-content/themes/dpga/css/style.css"
            type="text/css"
            media="all"
          />
          <link rel="canonical" href="/map/" />
          <script
            dangerouslySetInnerHTML={{
              __html: `var _gaq = _gaq || [];
   _gaq.push(['_setAccount', 'UA-143534016-1']);
   _gaq.push(['_trackPageview']);
   (function() {
   var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
   ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
   var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
   })();`,
            }}
          />
        </Head>
        <body>
          <div id="page">
            <header id="header">
              <nav className="navbar navbar-expand-xl navbar-light">
                <div className="container">
                  <button
                    className="navbar-toggler"
                    type="button"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span className="navbar-toggler-icon"></span>
                  </button>
                  <a className="navbar-brand" href="https://digitalpublicgoods.net">
                    <span>
                      <img
                        src="/wp-content/themes/dpga/images/logo.svg"
                        alt="Digital Public Goods Alliance"
                      />
                    </span>
                  </a>

                  <div className=" navbar-collapse" id="navbarNavDropdown">
                    <div className="menu-main-menu-container">
                      <ul id="menu-main-menu" className="menu">
                        <li
                          id="menu-item-51"
                          className="menu-item menu-item-type-custom menu-item-object-custom menu-item-51"
                        >
                          <a href="/">Home</a>
                        </li>
                        <li
                          id="menu-item-186"
                          className="menu-item menu-item-type-post_type menu-item-object-page menu-item-186"
                        >
                          <a href="/who-we-are/">Who We Are</a>
                        </li>
                        <li
                          id="menu-item-210"
                          className="menu-item menu-item-type-post_type menu-item-object-page menu-item-210"
                        >
                          <a href="/what-we-do/">What We Do</a>
                        </li>
                        <li
                          id="menu-item-87"
                          className="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-87"
                        >
                          <a href="/registry/">Registry</a>
                          <ul className="sub-menu">
                            <li
                              id="menu-item-562"
                              className="menu-item menu-item-type-post_type menu-item-object-page menu-item-562"
                            >
                              <a href="/standard/">Digital Public Goods Standard</a>
                            </li>
                            <li
                              id="menu-item-1088"
                              className="menu-item menu-item-type-post_type menu-item-object-page menu-item-1088"
                            >
                              <a href="/highlighted-digital-public-goods/">
                                Highlighted digital public goods
                              </a>
                            </li>
                          </ul>
                        </li>
                        <li
                          id="menu-item-263"
                          className="menu-item menu-item-type-post_type menu-item-object-page menu-item-263"
                        >
                          <a href="/get-involved/">Get Involved</a>
                        </li>
                        <li
                          id="menu-item-390"
                          className="menu-item menu-item-type-custom menu-item-object-custom menu-item-390"
                        >
                          <a href="/blog/">Blog</a>
                        </li>
                      </ul>
                    </div>{" "}
                    <button className="close">
                      <i className="icon-cancel"></i>
                    </button>
                  </div>

                  <a href="/?s=" className="search-form">
                    <i className="icon-search"></i>
                  </a>
                </div>
              </nav>
            </header>
          </div>
          <Main />
          <NextScript />
          <footer id="footer">
            <div>
              <div className="container">
                <div id="sidebar-footer" className="sidebar">
                  <aside id="text-2" className="widget widget_text">
                    <h5 className="widget-title">Connect</h5>{" "}
                    <div className="textwidget">
                      <p>
                        <span style={{fontWeight: 400}}>
                          <a href="https://mailchi.mp/4ae88231c358/digital-public-goods-mailing-list">
                            Sign up
                          </a>{" "}
                          to receive our monthly newsletter.
                        </span>
                      </p>
                    </div>
                  </aside>
                  <aside id="text-4" className="widget widget_text">
                    <h5 className="widget-title">Inquiries</h5>{" "}
                    <div className="textwidget">
                      <p>
                        Have a question?{" "}
                        <a href="mailto:hello@digitalpublicgoods.net">Contact us here</a>.
                      </p>
                    </div>
                  </aside>
                  <aside id="text-3" className="widget widget_text">
                    <h5 className="widget-title">Contribute</h5>{" "}
                    <div className="textwidget">
                      <p>
                        Join us by contributing on 
                        <a
                          href="https://github.com/dpgalliance"
                          target="_blank"
                          rel="noopener"
                        >
                          GitHub
                        </a>
                        .
                      </p>
                    </div>
                  </aside>{" "}
                </div>
              </div>
            </div>
            <div>
              <div className="container">
                <div className="site-info">
                  <a className="footer-brand" href="https://digitalpublicgoods.net">
                    <span>
                      <img
                        src="/wp-content/themes/dpga/images/logo-w.svg"
                        alt="Digital Public Goods Alliance"
                      />
                    </span>
                  </a>
                  <div>
                    <div className="menu-footer-menu-container">
                      <ul id="menu-footer-menu" className="menu">
                        <li
                          id="menu-item-895"
                          className="menu-item menu-item-type-post_type menu-item-object-page menu-item-895"
                        >
                          <a href="/standard/">Digital Public Goods Standard</a>
                        </li>
                        <li
                          id="menu-item-915"
                          className="menu-item menu-item-type-post_type menu-item-object-page menu-item-915"
                        >
                          <a href="/frequently-asked-questions/">
                            Frequently Asked Questions
                          </a>
                        </li>
                      </ul>
                    </div>{" "}
                    <p>Digital Public Goods Alliance - 2021 </p>
                  </div>
                </div>
                <div className="menu-social-container">
                  <ul id="menu-social" className="menu">
                    <li
                      id="menu-item-897"
                      className="twitter menu-item menu-item-type-custom menu-item-object-custom menu-item-897"
                    >
                      <a
                        target="_blank"
                        rel="noopener"
                        href="https://twitter.com/dpgalliance"
                      >
                        Twitter
                      </a>
                    </li>
                    <li
                      id="menu-item-898"
                      className="linkedin menu-item menu-item-type-custom menu-item-object-custom menu-item-898"
                    >
                      <a
                        target="_blank"
                        rel="noopener"
                        href="https://www.linkedin.com/company/dpgalliance"
                      >
                        LinkedIn
                      </a>
                    </li>
                    <li
                      id="menu-item-910"
                      className="medium menu-item menu-item-type-custom menu-item-object-custom menu-item-910"
                    >
                      <a
                        target="_blank"
                        rel="noopener"
                        href="https://medium.com/digital-public-goods"
                      >
                        Medium
                      </a>
                    </li>
                    <li
                      id="menu-item-911"
                      className="github menu-item menu-item-type-custom menu-item-object-custom menu-item-911"
                    >
                      <a
                        target="_blank"
                        rel="noopener"
                        href="https://github.com/dpgalliance"
                      >
                        Github
                      </a>
                    </li>
                  </ul>
                </div>{" "}
              </div>
            </div>
          </footer>
          <script
            type="text/javascript"
            src="/wp-content/themes/dpga/js/libs.min.js?ver=1622233620"
            id="dpga-libs-js"
          ></script>
          <script
            type="text/javascript"
            src="/wp-content/themes/dpga/js/dpga.min.js?ver=1622233620"
            id="dpga-main-js"
          ></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
