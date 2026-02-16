"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("../modules/job/routes"));
const redisClient_1 = __importDefault(require("../lib/redisClient"));
const apiKeyAuth_1 = require("../middleware/apiKeyAuth");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(apiKeyAuth_1.apiKeyAuth, routes_1.default);
process.env.API_KEY = 'test-key';
describe('Job API', () => {
    describe('POST /submit', () => {
        it('should return jobId for valid job', async () => {
            jest.spyOn(redisClient_1.default, 'rPush').mockResolvedValue(1);
            jest.spyOn(redisClient_1.default, 'hSet').mockResolvedValue(1);
            const validJob = { name: 'Test Job', priority: 1 };
            const res = await (0, supertest_1.default)(app).post('/submit').send(validJob).set('x-api-key', 'test-key');
            expect(res.status).toBe(200);
            expect(res.body.jobId).toBeDefined();
        });
        it('should return 400 for invalid job', async () => {
            const res = await (0, supertest_1.default)(app).post('/submit').send({}).set('x-api-key', 'test-key');
            expect(res.status).toBe(400);
        });
        it('should return 500 if Redis fails', async () => {
            jest.spyOn(redisClient_1.default, 'rPush').mockRejectedValue(new Error('Redis error'));
            const validJob = { name: 'Test Job', priority: 1 };
            const res = await (0, supertest_1.default)(app).post('/submit').send(validJob).set('x-api-key', 'test-key');
            expect(res.status).toBe(500);
        });
    });
    describe('GET /status/:id', () => {
        it('should return job status for existing job', async () => {
            jest.spyOn(redisClient_1.default, 'hGetAll').mockResolvedValue({ status: 'queued', data: '{}' });
            const res = await (0, supertest_1.default)(app).get('/status/123').set('x-api-key', 'test-key');
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('queued');
        });
        it('should return 404 for non-existent job', async () => {
            jest.spyOn(redisClient_1.default, 'hGetAll').mockResolvedValue({});
            const res = await (0, supertest_1.default)(app).get('/status/doesnotexist').set('x-api-key', 'test-key');
            expect(res.status).toBe(404);
        });
        it('should return 500 if Redis fails', async () => {
            jest.spyOn(redisClient_1.default, 'hGetAll').mockRejectedValue(new Error('Redis error'));
            const res = await (0, supertest_1.default)(app).get('/status/123').set('x-api-key', 'test-key');
            expect(res.status).toBe(500);
        });
    });
});
