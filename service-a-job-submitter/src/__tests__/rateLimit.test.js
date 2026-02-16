"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const routes_1 = __importDefault(require("../modules/job/routes"));
const apiKeyAuth_1 = require("../middleware/apiKeyAuth");
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1000, // 1 second for test
    max: 2,
    standardHeaders: true,
    legacyHeaders: false,
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(limiter);
app.use(apiKeyAuth_1.apiKeyAuth, routes_1.default);
describe('Rate Limiting', () => {
    it('should allow up to max requests', async () => {
        for (let i = 0; i < 2; i++) {
            const res = await (0, supertest_1.default)(app)
                .post('/submit')
                .send({ type: 'test', payload: {} })
                .set('x-api-key', 'test-key');
            expect(res.status).not.toBe(429);
        }
    });
    it('should block after max requests', async () => {
        for (let i = 0; i < 2; i++) {
            await (0, supertest_1.default)(app)
                .post('/submit')
                .send({ type: 'test', payload: {} })
                .set('x-api-key', 'test-key');
        }
        const res = await (0, supertest_1.default)(app)
            .post('/submit')
            .send({ type: 'test', payload: {} })
            .set('x-api-key', 'test-key');
        expect(res.status).toBe(429);
    });
});
