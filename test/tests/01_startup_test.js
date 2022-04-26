module.exports = test => test( 'Startup test' ,
  async(page,{ok}) => {

    ok(
      await page.find('button > .ico > svg'),
      'Theme switcher is exists'
    );

    ok(
      await page.findByText('Pick available connection in the list','div'),
      'Welcome message is showing'
    );

    ok(
      await page.findByText(/#\d 127.0.0.1/,'a'),
      'Link to connection is showing'
    );
  }
);