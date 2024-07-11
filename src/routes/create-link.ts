import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";


export async function createLink(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripid/links',{
        schema:{
            params:z.object({
                tripid: z.string().uuid()
            }),
            body: z.object({
                title: z.string().min(4),
                url: z.string().url()

            })
        }
    } ,async (request)=> {
        const {tripid } = request.params;
        const {title, url } = request.body;

        const trip = await prisma.trip.findUnique({
            where:{id: tripid}
        })

        if (!trip) {
            throw new Error('Trip not found')
        }

        const link = await prisma.link.create({
            data:{
                title, 
                url,
                trip_id: tripid,
            }
        })

        return { linkid: link.id }
    })
}