export default function PostJobPage() {
    return (
        <div>
            <h1>
                <form>
                    <div>
                        <label
                            htmlFor="title">

                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            className="" />
                    </div>

                    <div>
                        <label
                            htmlFor="company"
                            className="">
                            Company
                        </label>
                        <input 
                        type="text"
                        name="company"
                        id="company"
                        required
                        className="" />
                    </div>

                    <div>
                        <label 
                        htmlFor="text"
                        className="">
                            Job Type
                            </label>
                            <select name="type" id="type"
                            required
                            className="">
                                <option value="">Select a Type</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                            </select>
                    </div>

                    <div>
                        <label htmlFor="description"
                        className="">Description</label>

                        <textarea name="description" id="description"
                        rows={6}
                        required
                        className=""
                            />
                    </div>

                    <div>
                        <label htmlFor="salary"
                        className="">Salary (optional)</label>

                        <input type="text"
                        name="salary"
                        id="salary"
                        className="" />
                    </div>

                    <button
                    type="submit"
                    className="">
                        Post Job
                    </button>
                </form>
            </h1>
        </div>
    );
}