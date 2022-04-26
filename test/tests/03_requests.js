module.exports = test => test( 'Requests test' ,
  async(page,{ok,is}) => {

    const $link = await page.findByText(/#\d 127.0.0.1/,'a');
    ok( $link, 'Link to connection is exist' );

    await $link.click();
    await page.waitForTimeout(150); // fetching

    const $request = await page.find('.requests .card');
    ok( $request, 'At least one request is exist' );

    const $cells = await $request.findAll('table tr td:not(:first-child)');
    is( $cells.length, 16, 'Should be 16 bytes in request' );

    const $decButton = await $request.findByText('Dec','button');
    const $asciiButton = await $request.findByText('Ascii','button');
    ok( $decButton && $asciiButton, 'Mode buttons are exist' );

    const $c1 = $cells[0];
    is( await $c1.getText(), '48', 'First byte should be "48"' );

    await $decButton.click();
    is( await $c1.getText(), '72', 'First byte should be "72"' );

    await $asciiButton.click();
    is( await $c1.getText(), 'H', 'First byte should be "H"' );
  }
);