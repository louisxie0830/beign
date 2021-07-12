require("dotenv").config();
const Lab = require('@hapi/lab');
const Code = require('@hapi/code');
const init = require('../src/server')

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const before = lab.before;
const after = lab.after;
const it = lab.it;
const expect = Code.expect;

describe("Comment", () => {
    let server;

    before(async () => {
        server = await init();
    });

    after(async () => {
        await server.stop();
    });
    // it("should POST /organization/department/create responds with 200", async () => {
    //     const res = await server.inject({
    //         headers: {
    //             Authorization: "token"
    //         },
    //         auth: {
    //             strategy: "simple",
    //             credentials: {
    //                 userId: 2,
    //                 email: "string@no-reply@beingtech.org",
    //                 address: "1234567",
    //                 type: "password"
    //             },
    //             artifacts: { }
    //         },
    //         method: "POST",
    //         url: "/organization/department/create",
    //         payload: {
    //             companyId: 1,
    //             adminId: null,
    //             name: '部门2号'
    //         }
    //     });
    //     console.log(res.payload);
    //     expect(res.statusCode).to.equal(200);
    // });
    it("should GET /signing/corps responds with 200", async () => {
        const res = await server.inject({
            headers: {
                Authorization: "token"
            },
            auth: {
                strategy: "simple",
                credentials: {
                    userId: 44,
                    email: "string@no-reply@beingtech.org",
                    address: "1234567",
                    type: "password"
                },
                artifacts: { }
            },
            method: "GET",
            url: "/signing/corps?role=admin"
        });
        console.log(res.payload);
        expect(res.statusCode).to.equal(200);
    });
    // it("should GET /user/userinfo/query responds with 200", async () => {
    //     const res = await server.inject({
    //         headers: {
    //             Authorization: "token"
    //         },
    //         auth: {
    //             strategy: "simple",
    //             credentials: {
    //                 userId: 44,
    //                 email: "string@no-reply@beingtech.org",
    //                 address: "1234567",
    //                 type: "password"
    //             },
    //             artifacts: { }
    //         },
    //         method: "GET",
    //         url: "/user/userinfo/query?companyId=1&userId=50"
    //     });
    //     console.log(res.payload);
    //     expect(res.statusCode).to.equal(200);
    // });
    // it("should GET /organization/department/query responds with 200", async () => {
    //     const res = await server.inject({
    //         headers: {
    //             Authorization: "token"
    //         },
    //         auth: {
    //             strategy: "simple",
    //             credentials: {
    //                 userId: 44,
    //                 email: "string@no-reply@beingtech.org",
    //                 address: "1234567",
    //                 type: "password"
    //             },
    //             artifacts: { }
    //         },
    //         method: "GET",
    //         url: "/organization/department/query?departmentId=1"
    //     });
    //     console.log(res.payload);
    //     expect(res.statusCode).to.equal(200);
    // });
    // it("should GET /certification/list responds with 200", async () => {
    //     const res = await server.inject({
    //         headers: {
    //             Authorization: "token"
    //         },
    //         auth: {
    //             strategy: "simple",
    //             credentials: {
    //                 userId: 44,
    //                 email: "string@no-reply@beingtech.org",
    //                 address: "1234567",
    //                 type: "password"
    //             },
    //             artifacts: { }
    //         },
    //         method: "GET",
    //         url: "/certification/list?companyId=&type=1&start=0&limit=10"
    //     });
    //     console.log(res.payload);
    //     expect(res.statusCode).to.equal(200);
    // });
    // it("should POST /user/userinfo/update responds with 200", async () => {
    //     const res = await server.inject({
    //         headers: {
    //             Authorization: "token"
    //         },
    //         auth: {
    //             strategy: "simple",
    //             credentials: {
    //                 userId: 5,
    //                 email: "string@no-reply@beingtech.org",
    //                 address: "1234567",
    //                 type: "password"
    //             },
    //             artifacts: { }
    //         },
    //         method: "POST",
    //         url: "/user/userinfo/update",
    //         payload: {
    //             companyId: 1,
    //             userId: 5,
    //             departmentId: 2,
    //             mobile: '13322332233',
    //             city: 'guangzhou',
    //             country: 'china',
    //             name: 'name123'
    //         }
    //     });
    //     console.log(res.payload);
    //     expect(res.statusCode).to.equal(200);
    // });
});