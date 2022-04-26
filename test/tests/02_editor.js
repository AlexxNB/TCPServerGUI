module.exports = test => test( 'Startup test' ,
  async(page,{ok,is,not}) => {

    const $link = await page.findByText(/#\d 127.0.0.1/,'a');
    ok( $link, 'Link to connection is exist' );

    await $link.click();

    const $editorPane = await page.find('.editor.bt');
    ok( $editorPane, 'Editor Pane is exist' );

    const $sendButton = await $editorPane.findByText('Send','button');
    ok( $sendButton, 'Send button is exist' );
    ok( await $sendButton.isDisabled(), 'Send button should be disabled' );

    const $inputs = await $editorPane.findAll('td > input');
    is( $inputs.length, 32, 'Number of inputs in editor should be 32' );

    const [$i1,$i2,$i3,$i4] = $inputs;

    await $i1.type('ff61');
    await $i3.type('2');
    await page.keyboard.press('Enter');
    await $i4.type('K');
    await page.keyboard.press('Enter');

    is( await $i1.getValue(), 'FF', 'First byte should be "FF"' );
    is( await $i2.getValue(), '61', 'First byte should be "61"' );
    is( await $i3.getValue(), '02', 'Third byte should be "02"' );
    is( await $i4.getValue(), '', 'Fourth byte should be empty' );

    not( await $sendButton.isDisabled(), 'Send button should not be disabled' );

    const $decButton = await $editorPane.findByText('Dec','button');
    const $asciiButton = await $editorPane.findByText('Ascii','button');
    ok( $decButton && $asciiButton, 'Mode buttons are exist' );

    await $decButton.click();

    is( await $i1.getValue(), '255', 'First byte should be "255"' );

    await $asciiButton.click();

    is( await $i2.getValue(), 'a', 'First byte should be "a"' );

    is( (await page.findAll('.requests table')).length, 1, 'Should be one request' );

    await $sendButton.click();
    await page.waitForTimeout(100); // fetching

    is( await $i1.getValue(), '', 'First byte should be empty' );

    is( (await page.findAll('.requests table')).length, 3, 'Should be three requests' ); // Hello, request and echo-answer

    ok( await $sendButton.isDisabled(), 'Send button should be disabled' );
  }
);