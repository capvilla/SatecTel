const puppeteer = require('puppeteer');
const botAcciones = require('../puppeteer/puppeteer');

const buttonZona = 'table.table tbody tr:nth-child(1) td:nth-child(17) button';
const description = '[class="description"]';

async function signInPage(info) {

    try {
        const { tarea, expediente, opcion, prioridad } = info;

        let success = false;
        //console.log({ info });

        const browser = await puppeteer.launch({
            // args: [
            //     "--disable-setuid-sandbox",
            //     '--no-sandbox',
            //     "--single-process",
            //     "--no-zygote",
            //     // '--disable-gpu',
            //     // '--disable-dev-shm-usage',
            //     // '--disable-setuid-sandbox',
            //     // '--no-first-run',
            //     // '--no-sandbox',
            //     // '--no-zygote',
            //     // '--deterministic-fetch',
            //     // '--disable-features=IsolateOrigins',
            //     // '--disable-site-isolation-trials',
            //     // '--disable-features=site-per-process',
            // ],
            executablePath:
                process.env.NODE_ENV === 'production'
                    ? process.env.PUPPETEER_EXECUTABLE_PATH
                    : puppeteer.executablePath(),
            ignoreDefaultArgs: ['--disable-extensions'],

            headless: 'new'
        });

        // console.log({ info });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1920,
            height: 1080,
        });
        await page.goto('https:satec.rednacional.com/SatecAbc/#/Login');
        await page.type('[name="username"]', 'CarlosArtur3168');
        await page.type('[name="password"]', 'CarlosArtur3168');
        await page.click('button[class="btn btn-primary pull-right"]');
        await page.waitForNavigation();
        await page.evaluate(() => {
            return new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
        });
        await page.click('a[ href="#/Listado-usuario-tecnico"]');
        await page.evaluate(() => {
            return new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
        });
        await page.waitForSelector(description);

        await page.evaluate(() => {
            return new Promise((resolve) => {
                setTimeout(resolve, 1500);  //Espera 5 segundos antes de continuar
            });
        });


        const select = await page.$('select[name="sistema"]');
        await select.select('expediente');

        await page.type('[name="txtBuscar"]', expediente);
        await page.click('button[ type="submit"]');
        await page.waitForSelector(description);





        switch (tarea) {
            case 'COPE':
                console.log({ opcion });
                success = await botAcciones.editCOPE(page, opcion);
                break;

            case 'MODALIDAD':
                success = await botAcciones.editModalidad(page, opcion);
                break;

            case 'AMBOS':
                success = await botAcciones.editCOPEandModalidad(page, opcion);
                break;
            case 'ZONIFICAR':
                success = await botAcciones.editZonas(page, opcion, prioridad, browser)
                break;

        }

        console.log(`success: ${success}`);

        // await page.screenshot({
        //     path: 'screenshot.png',
        //     fullPage: true,
        // });
        await browser.close();


        return success;


    } catch (error) {

        console.log(error);
        console.error("Cannot launch browser or wrong message")
        return false
    }

}

module.exports = {
    signInPage
}